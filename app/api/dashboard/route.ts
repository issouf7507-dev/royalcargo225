import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

const JOUR = 86_400_000;
const MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Seuils des alertes « À traiter »
const ATTENTE_MAX_JOURS = 14;

const estMaritime = (service: string) => /maritime/i.test(service);

/** Chiffres du tableau de bord. `jours` : 30, 90 ou 365 (période comparée à la précédente de même durée). */
export async function GET(request: Request) {
  const id = await getSessionUserId();
  if (!id || !(await prisma.user.findUnique({ where: { id }, select: { id: true } }))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const jours = [30, 90, 365].includes(Number(new URL(request.url).searchParams.get("jours")))
    ? Number(new URL(request.url).searchParams.get("jours"))
    : 30;

  const colis = await prisma.adresse.findMany({
    select: {
      id: true,
      nom: true,
      status: true,
      service: true,
      pays: true,
      poids: true,
      volume: true,
      prix: true,
      codeTracking: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const maintenant = Date.now();
  const debut = maintenant - jours * JOUR;
  const debutPrec = debut - jours * JOUR;
  const periode = colis.filter((c) => c.createdAt.getTime() >= debut);
  const precedente = colis.filter((c) => c.createdAt.getTime() >= debutPrec && c.createdAt.getTime() < debut);

  const somme = (l: typeof colis, f: (c: (typeof colis)[number]) => number | null) => l.reduce((t, c) => t + (f(c) ?? 0), 0);
  const indicateurs = (l: typeof colis) => ({
    colis: l.length,
    chiffreAffaires: somme(l, (c) => c.prix),
    poids: somme(l, (c) => (estMaritime(c.service) ? 0 : c.poids)),
    volume: somme(l, (c) => (estMaritime(c.service) ? c.volume : 0)),
  });

  const compter = (l: typeof colis, cle: (c: (typeof colis)[number]) => string) => {
    const m = new Map<string, number>();
    for (const c of l) m.set(cle(c), (m.get(cle(c)) ?? 0) + 1);
    return Array.from(m, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };

  // 12 derniers mois : colis par service et chiffre d'affaires
  const ref = new Date();
  const mensuel = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(ref.getFullYear(), ref.getMonth() - 11 + i, 1);
    const du = d.getTime();
    const au = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    const l = colis.filter((c) => c.createdAt.getTime() >= du && c.createdAt.getTime() < au);
    return {
      name: `${MOIS_COURTS[d.getMonth()]}${d.getMonth() === 0 || i === 0 ? ` ${String(d.getFullYear()).slice(2)}` : ""}`,
      aerien: l.filter((c) => !estMaritime(c.service)).length,
      maritime: l.filter((c) => estMaritime(c.service)).length,
      chiffreAffaires: somme(l, (c) => c.prix),
    };
  });

  const aTraiter = {
    attenteLongue: colis.filter((c) => c.status === "En attente de réception" && maintenant - c.createdAt.getTime() > ATTENTE_MAX_JOURS * JOUR).length,
    recusAExpedier: colis.filter((c) => c.status === "Colis reçu").length,
    sansPrix: colis.filter((c) => (c.status === "Colis reçu" || c.status === "Colis envoye") && !c.prix).length,
    aRetirer: colis.filter((c) => c.status === "Arrive à Abidjan").length,
  };

  return NextResponse.json({
    jours,
    seuilAttente: ATTENTE_MAX_JOURS,
    total: colis.length,
    periode: indicateurs(periode),
    precedente: indicateurs(precedente),
    statuts: compter(colis, (c) => c.status),
    services: compter(periode, (c) => c.service),
    pays: compter(periode, (c) => c.pays),
    mensuel,
    aTraiter,
    recents: colis.slice(0, 6).map((c) => ({
      id: c.id,
      nom: c.nom,
      status: c.status,
      service: c.service,
      prix: c.prix,
      codeTracking: c.codeTracking,
      createdAt: c.createdAt,
    })),
  });
}
