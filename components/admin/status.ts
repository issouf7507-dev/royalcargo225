import type { Tone } from "./ui";

/** Statuts d'un colis : valeur stockée en base, libellé affiché et couleur. */
export const STATUTS: { value: string; label: string; tone: Tone; dot: string; color: string }[] = [
  { value: "En attente de réception", label: "En attente de réception", tone: "amber", dot: "bg-amber-500", color: "#f59e0b" },
  { value: "Colis reçu", label: "Colis reçu", tone: "blue", dot: "bg-blue-500", color: "#3b82f6" },
  { value: "Colis envoye", label: "Colis envoyé", tone: "green", dot: "bg-emerald-500", color: "#10b981" },
  { value: "Arrive à Abidjan", label: "Arrivé à Abidjan", tone: "violet", dot: "bg-violet-500", color: "#8b5cf6" },
];

export const statut = (value: string) =>
  STATUTS.find((s) => s.value === value) ?? { value, label: value, tone: "gray" as Tone, dot: "bg-slate-400", color: "#94a3b8" };
