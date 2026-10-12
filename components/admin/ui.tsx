"use client";

import { ArrowDown, ArrowRight, ArrowUp, Inbox, Info, Search, X } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/* ---------- Boutons ---------- */

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  accent: "bg-accent-500 text-white hover:bg-accent-600",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes: Record<Size, string> = { sm: "h-8 px-2.5 text-xs", md: "h-9 px-3.5 text-sm" };

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...props
}: { variant?: Variant; size?: Size; icon?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}

/** Petit bouton contour des barres d'outils. */
export function ToolButton({
  icon,
  children,
  onClick,
  active,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50",
        active && "bg-slate-50"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------- Pastilles ---------- */

export type Tone = "gray" | "red" | "amber" | "green" | "blue" | "violet";

const tones: Record<Tone, string> = {
  gray: "bg-slate-100 text-slate-600 ring-slate-500/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
};
const dots: Record<Tone, string> = {
  gray: "bg-slate-400",
  red: "bg-red-500",
  amber: "bg-amber-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
};

export function Badge({ tone = "gray", children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone]
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}

/* ---------- Cadres ---------- */

/** Carte encadrée : un cadre gris clair qui porte le titre, le contenu dans un panneau posé dedans. */
export function Panel({
  title,
  description,
  info,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  info?: string;
  actions?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-1 overflow-hidden rounded-xl bg-panel ring-1 ring-slate-900/[0.07]", className)}>
      <header className="flex min-h-[3.25rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5">
        <div className="min-w-0 space-y-1">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold leading-snug text-slate-900">
            {title}
            {info && (
              <span title={info} className="text-slate-400">
                <Info className="size-3.5" aria-label={info} />
              </span>
            )}
          </h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className={cn("flex-1 overflow-hidden rounded-lg bg-surface p-4 ring-1 ring-slate-900/5", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Cadre simple (sans titre) autour d'un contenu gris clair : utilisé pour les listes. */
export function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-xl bg-panel p-1 ring-1 ring-slate-900/[0.07]", className)}>
      <div className="rounded-lg bg-surface ring-1 ring-slate-900/5">{children}</div>
    </section>
  );
}

/* ---------- Tableau de bord ---------- */

/** Pastille d'évolution (+12 % en vert, -5 % en rouge). Rien si pas de comparaison possible. */
export function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta == null) return null;
  const pct = Math.round(delta * 100);
  const up = pct > 0;
  const down = pct < 0;
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-0.5 rounded-full px-2 text-xs font-medium tabular-nums ring-1 ring-inset",
        up && "bg-emerald-50 text-emerald-700 ring-emerald-500/40",
        down && "bg-red-50 text-red-700 ring-red-500/30",
        !up && !down && "bg-slate-100 text-slate-600 ring-slate-400/30"
      )}
    >
      {up && <ArrowUp className="size-3" />}
      {down && <ArrowDown className="size-3" />}
      {Math.abs(pct)} %
    </span>
  );
}

/** Carte indicateur : grand chiffre + pastille, ligne d'aide, lien en pied. */
export function KpiCard({
  title,
  value,
  badge,
  hint,
  href,
  linkLabel = "Voir plus",
  className,
}: {
  title: ReactNode;
  value: ReactNode;
  badge?: ReactNode;
  hint?: ReactNode;
  href: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <Panel title={title} className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</span>
        {badge}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      <div className="my-3 h-px bg-slate-900/[0.07]" />
      <Link href={href} className="flex w-full items-center justify-between text-xs text-slate-500 hover:text-slate-900">
        {linkLabel} <ArrowRight className="size-3" />
      </Link>
    </Panel>
  );
}

/** Carte mise en avant (sans titre), avec un motif décoratif aux couleurs du back office. */
export function HeroPanel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("relative overflow-hidden rounded-xl bg-panel p-1 ring-1 ring-slate-900/[0.07]", className)}>
      <div className="relative h-full overflow-hidden rounded-lg bg-surface p-4 ring-1 ring-slate-900/5">
        <svg className="pointer-events-none absolute -right-16 -top-16 size-72 text-brand-500" viewBox="0 0 200 200" aria-hidden="true">
          {[90, 70, 50, 30].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeOpacity={0.06 + i * 0.03} strokeWidth="1.5" />
          ))}
          <circle cx="100" cy="100" r="12" className="text-accent-500" fill="currentColor" fillOpacity="0.25" />
        </svg>
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}

/** Répartition : une ligne par élément (nom, nombre, part du total) avec une fine barre de couleur. */
export function ShareList({ items, total }: { items: { name: string; value: number; color: string; href?: string }[]; total: number }) {
  return (
    <div className="space-y-5">
      {items.map((it) => {
        const part = total ? it.value / total : 0;
        const label = (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-800">{it.name}</span>
              <span className="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-900/10">
                {it.value.toLocaleString("fr-FR")}
              </span>
            </div>
            <span className="tabular-nums text-slate-700">{Math.round(part * 100)} %</span>
          </div>
        );
        return (
          <div key={it.name} className="space-y-2">
            {it.href ? (
              <Link href={it.href} className="block hover:opacity-80">
                {label}
              </Link>
            ) : (
              label
            )}
            <div className="h-1 overflow-hidden rounded-full bg-slate-200/80">
              <div className="h-full rounded-full" style={{ width: `${part * 100}%`, background: it.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Petit chiffre clé dans l'en-tête d'une carte (pastille de couleur + libellé + valeur). */
export function HeaderStat({ label, value, color }: { label: string; value: ReactNode; color: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="size-2 self-center rounded-full" style={{ background: color }} />
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-lg font-semibold leading-none tabular-nums text-slate-900">{value}</span>
    </div>
  );
}

/* ---------- Indicateurs ---------- */

type KpiTone = "default" | "red" | "amber" | "green" | "brand" | "violet";
const kpiAccents: Record<KpiTone, string> = {
  default: "bg-slate-100 text-slate-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  brand: "bg-brand-50 text-brand-600",
  violet: "bg-violet-50 text-violet-600",
};

/** Carte indicateur (cliquable pour filtrer la liste). */
export function Kpi({
  label,
  value,
  hint,
  icon,
  tone = "default",
  onClick,
  active,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: KpiTone;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "block w-full rounded-xl bg-panel p-1 text-left ring-1 ring-slate-900/[0.07] transition",
        onClick && "hover:ring-brand-200",
        active && "ring-2 ring-brand-500"
      )}
    >
      <div className="flex items-start justify-between gap-3 rounded-lg bg-surface p-4 ring-1 ring-slate-900/5">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && <div className={cn("rounded-lg p-2 [&>svg]:size-5", kpiAccents[tone])}>{icon}</div>}
      </div>
    </button>
  );
}

/* ---------- En-têtes ---------- */

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">{title}</h1>
        {subtitle && <div className="mt-1 text-sm text-slate-500">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <Inbox className="size-8 text-slate-300" />
      <p className="font-medium text-slate-700">{title}</p>
      {children && <div className="text-sm text-slate-500">{children}</div>}
    </div>
  );
}

/* ---------- Champs ---------- */

const control =
  "w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50";

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-[13px] font-medium leading-none text-slate-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "h-9", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-20 py-2", className)} {...props} />;
}

export function Select({
  options,
  placeholder,
  dot,
  className,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: readonly (string | { value: string; label: string })[];
  placeholder?: string;
  /** Pastille de couleur affichée devant la valeur */
  dot?: string;
}) {
  const select = (
    <select className={cn(control, "h-9 pr-8", dot && "pl-7", className)} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const { value, label } = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
  if (!dot) return select;
  return (
    <span className="relative block">
      <span className={cn("pointer-events-none absolute left-3 top-1/2 size-2 -translate-y-1/2 rounded-full", dot)} />
      {select}
    </span>
  );
}

/** Champ de recherche compact des barres d'outils. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher"
        className="h-7 w-full rounded-md border border-slate-300 bg-white pl-8 pr-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}

/* ---------- Fenêtres ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "flex max-h-[90vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl",
          size === "md" ? "sm:max-w-lg" : "sm:max-w-3xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Fermer">
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Supprimer",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
