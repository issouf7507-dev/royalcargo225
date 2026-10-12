import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSms, toInternational } from "@/lib/sms";

const STATUTS = ["En attente de réception", "Colis reçu", "Colis envoye", "Arrive à Abidjan"] as const;

const schema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Aucun destinataire").max(500, "500 destinataires maximum par envoi"),
  // {nom} et {code} sont remplacés pour chaque destinataire
  message: z.string().trim().min(1, "Message vide").max(1000, "Message trop long"),
  // Statut à appliquer aux colis sélectionnés (facultatif)
  statut: z.enum(STATUTS).optional(),
});

// Envois en parallèle limités, pour ne pas saturer le fournisseur
const CONCURRENCE = 5;

/** Envoi d'un même message (personnalisé) à plusieurs clients : retard, départ, arrivée… */
export async function POST(request: Request) {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }
  const { ids, message, statut } = parsed.data;

  try {
    const adresses = await prisma.adresse.findMany({
      where: { id: { in: ids } },
      select: { id: true, nom: true, tel: true, codeTracking: true },
    });

    // Un client avec plusieurs colis ne reçoit pas deux fois le même texte
    const envois = new Map<string, { to: string; texte: string; nom: string }>();
    const ignores: { nom: string; tel: string; erreur: string }[] = [];
    for (const a of adresses) {
      if (!a.tel?.trim()) {
        ignores.push({ nom: a.nom, tel: a.tel ?? "", erreur: "Numéro manquant" });
        continue;
      }
      const to = toInternational(a.tel);
      const texte = message.replace(/\{nom\}/g, a.nom).replace(/\{code\}/g, a.codeTracking ?? "");
      envois.set(`${to}\n${texte}`, { to, texte, nom: a.nom });
    }

    const liste = Array.from(envois.values());
    const echecs = [...ignores];
    let envoyes = 0;
    for (let i = 0; i < liste.length; i += CONCURRENCE) {
      const lot = liste.slice(i, i + CONCURRENCE);
      const res = await Promise.all(
        lot.map((e) =>
          sendSms(e.to, e.texte).catch((err) => ({ ok: false, status: 0, data: { error: String(err) } }))
        )
      );
      res.forEach((r, j) => {
        if (r.ok) envoyes++;
        else
          echecs.push({
            nom: lot[j].nom,
            tel: lot[j].to,
            erreur: (r.data && (r.data.message || r.data.error)) || `Erreur ${r.status}`,
          });
      });
    }

    let misAJour = 0;
    if (statut) {
      const res = await prisma.adresse.updateMany({ where: { id: { in: adresses.map((a) => a.id) } }, data: { status: statut } });
      misAJour = res.count;
    }

    return NextResponse.json({ envoyes, echecs, misAJour, introuvables: ids.length - adresses.length });
  } catch (error) {
    console.error("Erreur envoi SMS de masse:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
