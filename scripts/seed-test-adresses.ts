/**
 * Colis fictifs pour tester le back office (base locale uniquement).
 * Lancement : npm run seed:test-adresses
 * Relancer le script remplace les colis de test (code TEST-…) ; les autres ne sont pas touchés.
 * Les numéros commencent par 00 : ils n'existent pas en Côte d'Ivoire ni au Mali.
 */
import { prisma } from "@/lib/prisma";

const joursAvant = (n: number) => new Date(Date.now() - n * 86_400_000);

const ADRESSES = [
  { nom: "Kouassi Aya", tel: "0000000001", pays: "COTE_D_IVOIRE", service: "Envoie Maritime", status: "Colis reçu", poids: 45, volume: 0.35, prix: 120000, jours: 3 },
  { nom: "Traoré Moussa", tel: "0000000002", pays: "MALI", service: "Envoie Maritime", status: "Colis reçu", poids: 120, volume: 1.2, prix: 380000, jours: 5 },
  { nom: "Koné Mariam", tel: "0000000003", pays: "COTE_D_IVOIRE", service: "Envoie Maritime", status: "En attente de réception", poids: null, volume: null, prix: null, jours: 1 },
  { nom: "Yao Serge", tel: "0000000004", pays: "COTE_D_IVOIRE", service: "Envoie Maritime", status: "Colis envoye", poids: 80, volume: 0.8, prix: 250000, jours: 12 },
  { nom: "Diallo Fatou", tel: "0000000005", pays: "MALI", service: "Envoie Maritime", status: "Arrive à Abidjan", poids: 60, volume: 0.5, prix: 170000, jours: 40 },
  { nom: "Bamba Ibrahim", tel: "0000000006", pays: "COTE_D_IVOIRE", service: "Envoie express", status: "Colis reçu", poids: 8.5, volume: null, prix: 85000, jours: 2 },
  { nom: "N'Guessan Paul", tel: "0000000007", pays: "COTE_D_IVOIRE", service: "Envoie Normal", status: "Colis reçu", poids: 15, volume: null, prix: 105000, jours: 4 },
  { nom: "Coulibaly Awa", tel: "0000000008", pays: "MALI", service: "Envoie Normal", status: "En attente de réception", poids: null, volume: null, prix: null, jours: 0 },
] as const;

async function main() {
  const host = process.env.DATABASE_HOST;
  if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1"].includes(host ?? "")) {
    throw new Error(`Refusé : la base (${host}) n'est pas locale.`);
  }

  await prisma.adresse.deleteMany({ where: { codeTracking: { startsWith: "TEST-" } } });

  for (const [i, a] of ADRESSES.entries()) {
    const date = joursAvant(a.jours);
    await prisma.adresse.create({
      data: {
        nom: a.nom,
        tel: a.tel,
        pays: a.pays,
        type: "Colis",
        service: a.service,
        status: a.status,
        poids: a.poids,
        volume: a.volume,
        prix: a.prix,
        date,
        description: "Colis de test",
        etat: "Bon état",
        codeTracking: `TEST-${String(i + 1).padStart(4, "0")}`,
        createdAt: date,
      },
    });
    console.log(`✓ ${a.nom} (${a.service}, ${a.status})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
