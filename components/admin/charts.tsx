"use client";

/*
 * Graphiques du tableau de bord en SVG / CSS, sans bibliothèque :
 * recharts 2.12 (installé) ne s'affiche pas avec le React 19 de Next 16.
 * Les couleurs passent par les variables du back office (mode sombre compris).
 */

import { useState } from "react";

/** Graduations « rondes » de l'axe vertical (0 … max). */
function graduations(max: number, n = 4) {
  if (max <= 0) return [0, 1];
  const brut = max / n;
  const puissance = 10 ** Math.floor(Math.log10(brut));
  const pas = [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut) ?? brut;
  return Array.from({ length: Math.ceil(max / pas) + 1 }, (_, i) => i * pas);
}

interface Serie {
  key: string;
  label: string;
  color: string;
}

/** Barres verticales (empilées si plusieurs séries) avec axe, grille et infobulle au survol. */
function BarChart({
  data,
  series,
  format,
  height,
  legend,
}: {
  data: Record<string, string | number>[];
  series: Serie[];
  format: (v: number) => string;
  height: number;
  legend?: boolean;
}) {
  const [survol, setSurvol] = useState<number | null>(null);
  const totaux = data.map((d) => series.reduce((t, s) => t + Number(d[s.key] ?? 0), 0));
  const ticks = graduations(Math.max(0, ...totaux));
  const max = ticks[ticks.length - 1] || 1;
  const hauteurBarres = height - 24;

  return (
    <div>
      <div className="flex gap-2" style={{ height }}>
        {/* Axe vertical */}
        <div className="relative w-12 shrink-0" style={{ height: hauteurBarres }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 text-[11px] tabular-nums text-slate-500"
              style={{ bottom: `${(t / max) * 100}%`, transform: "translateY(50%)" }}
            >
              {format(t)}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Grille */}
          <div className="absolute inset-x-0 top-0" style={{ height: hauteurBarres }}>
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-slate-200" style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
          </div>

          {/* Barres */}
          <div className="relative flex h-full">
            {data.map((d, i) => (
              <div
                key={String(d.name)}
                className="relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setSurvol(i)}
                onMouseLeave={() => setSurvol(null)}
              >
                <div
                  className={i === survol ? "absolute inset-x-0.5 top-0 rounded-md bg-slate-100" : "hidden"}
                  style={{ height: hauteurBarres }}
                />
                <div className="relative flex w-full justify-center" style={{ height: hauteurBarres }}>
                  <div className="flex h-full w-[60%] max-w-[36px] flex-col-reverse">
                    {series.map((s, j) => {
                      const v = Number(d[s.key] ?? 0);
                      const derniere = series.slice(j + 1).every((x) => !Number(d[x.key] ?? 0));
                      return (
                        v > 0 && (
                          <div
                            key={s.key}
                            style={{ height: `${(v / max) * 100}%`, background: s.color }}
                            className={derniere ? "rounded-t-[4px]" : "border-t-2 border-surface"}
                          />
                        )
                      );
                    })}
                  </div>
                </div>
                <span className="mt-2 truncate text-[11px] text-slate-500">{d.name}</span>

                {i === survol && (
                  <div
                    className="pointer-events-none absolute z-10 min-w-32 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs shadow-lg"
                    style={{ bottom: `calc(${(totaux[i] / max) * hauteurBarres}px + 32px)`, left: "50%", transform: "translateX(-50%)" }}
                  >
                    <p className="mb-1 text-slate-500">{d.name}</p>
                    {series.map((s) => (
                      <p key={s.key} className="flex items-center justify-between gap-3 text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full" style={{ background: s.color }} />
                          {s.label}
                        </span>
                        <span className="font-medium tabular-nums">{format(Number(d[s.key] ?? 0))}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {legend && (
        <div className="mt-3 flex justify-center gap-4 text-xs text-slate-600">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Barres empilées par mois (ex. colis aériens / maritimes). */
export function StackedBarChart({
  data,
  series,
  height = 260,
}: {
  data: Record<string, string | number>[];
  series: Serie[];
  height?: number;
}) {
  return <BarChart data={data} series={series} height={height} format={(v) => v.toLocaleString("fr-FR")} legend />;
}

/** Barres simples (ex. chiffre d'affaires par mois). */
export function SimpleBarChart({
  data,
  dataKey,
  label,
  color,
  format = (v: number) => String(v),
  height = 284,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  label: string;
  color: string;
  format?: (v: number) => string;
  height?: number;
}) {
  return <BarChart data={data} series={[{ key: dataKey, label, color }]} height={height} format={format} />;
}

/** Anneau avec total au centre. */
export function DonutChart({
  data,
  centerLabel,
  height = 220,
}: {
  data: { name: string; value: number; color: string }[];
  centerLabel: string;
  height?: number;
}) {
  const [survol, setSurvol] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const visibles = data.filter((d) => d.value > 0);
  const r = 40;
  const circonference = 2 * Math.PI * r;
  const ecart = visibles.length > 1 ? 1.2 : 0; // espace entre les parts
  let cumul = 0;
  const actif = visibles.find((d) => d.name === survol);

  return (
    <div className="relative mx-auto" style={{ height, width: height }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(var(--slate-200))" strokeWidth="11" />
        {visibles.map((d) => {
          const longueur = (d.value / total) * circonference;
          const debut = cumul;
          cumul += longueur;
          return (
            <circle
              key={d.name}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={survol === d.name ? 13 : 11}
              strokeDasharray={`${Math.max(0, longueur - ecart)} ${circonference}`}
              strokeDashoffset={-debut}
              className="cursor-pointer transition-[stroke-width]"
              onMouseEnter={() => setSurvol(d.name)}
              onMouseLeave={() => setSurvol(null)}
            >
              <title>{`${d.name} : ${d.value}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
          {(actif ? actif.value : total).toLocaleString("fr-FR")}
        </span>
        <span className="max-w-[60%] text-xs text-slate-500">{actif ? actif.name : centerLabel}</span>
      </div>
    </div>
  );
}
