/** Modèles et calculs des SMS groupés (page /sms). */

export type TypeSms = "depart" | "retard" | "arrivee" | "libre";

export const TYPES_SMS: { value: TypeSms; label: string; description: string; statut?: string }[] = [
  { value: "depart", label: "Départ", description: "Les colis ont quitté la Chine", statut: "Colis envoye" },
  { value: "retard", label: "Retard", description: "Nouvelle date d'arrivée" },
  { value: "arrivee", label: "Arrivée", description: "Colis disponibles à Abidjan", statut: "Arrive à Abidjan" },
  { value: "libre", label: "Message libre", description: "Texte personnalisé" },
];

const PIED = `Service client Abidjan : 07 02 67 02 02
royalcargor225.com`;

/** Motifs de retard proposés (sans caractères hors GSM-7, comme « ô »). */
export const MOTIFS_RETARD = [
  "Retard du navire",
  "Retard ou annulation du vol",
  "Retard de chargement en Chine",
  "Formalités douanières",
  "Congestion au port",
  "Conditions météo",
];

export const aujourdhui = () => new Date().toISOString().slice(0, 10);
const enFr = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "");

/** Modèles sans emoji ni caractères hors GSM-7 (sinon le SMS passe en Unicode, 70 caractères par partie). */
export function modeleSms(type: TypeSms, o: { depart: string; arrivee: string; motif: string }) {
  const arrivee = enFr(o.arrivee);
  switch (type) {
    case "depart":
      return `ROYAL CARGO

M/MME {nom},

Vos colis ont quitté la Chine le ${enFr(o.depart)}.
${arrivee ? `Arrivée prévue : ${arrivee}\n` : ""}
Tout retard vous sera signalé par message.

Retrait sous 5 jours après arrivée, sinon frais de magasinage de 5 000 à 30 000 FCFA par jour.

${PIED}`;
    case "retard":
      return `ROYAL CARGO

M/MME {nom},

Nous vous informons d'un retard dans l'acheminement de vos colis.
${o.motif.trim() ? `Motif : ${o.motif.trim()}.\n` : ""}${arrivee ? `Nouvelle date d'arrivée prévue : ${arrivee}.\n` : ""}
Nous vous prions de nous excuser pour ce désagrément.

${PIED}`;
    case "arrivee":
      return `ROYAL CARGO

M/MME {nom},

Vos colis sont arrivés à Abidjan et sont disponibles au retrait.

Retrait sous 5 jours, sinon frais de magasinage de 5 000 à 30 000 FCFA par jour.

${PIED}`;
    default:
      return `ROYAL CARGO

M/MME {nom},

`;
  }
}

/** Remplace {nom} et {code} pour un destinataire (même règle que l'API). */
export const personnaliser = (message: string, d: { nom: string; codeTracking: string | null }) =>
  message.replace(/\{nom\}/g, d.nom).replace(/\{code\}/g, d.codeTracking ?? "");

// Alphabet GSM-7 (les caractères de l'extension comptent double)
const GSM = new Set(
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"
);
const GSM_EXT = new Set("^{}\\[~]|€");

/** Longueur et nombre de parties d'un SMS. */
export function compterSms(texte: string) {
  const chars = Array.from(texte);
  const horsGsm = Array.from(new Set(chars.filter((c) => !GSM.has(c) && !GSM_EXT.has(c))));
  if (horsGsm.length) {
    const n = chars.length;
    return { longueur: n, parties: n <= 70 ? 1 : Math.ceil(n / 67), horsGsm };
  }
  const n = chars.reduce((t, c) => t + (GSM_EXT.has(c) ? 2 : 1), 0);
  return { longueur: n, parties: n <= 160 ? 1 : Math.ceil(n / 153), horsGsm };
}

export interface ResultatSms {
  envoyes: number;
  misAJour: number;
  introuvables: number;
  echecs: { nom: string; tel: string; erreur: string }[];
}

/** Sélection transmise par la liste des adresses (« Envoyer un SMS ») à la page /sms. */
export const SELECTION_KEY = "rc.bo.sms.selection";
