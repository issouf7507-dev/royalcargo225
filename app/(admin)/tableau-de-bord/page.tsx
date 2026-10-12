"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, ChevronRight, Loader2, MessageSquareText, RefreshCw } from "lucide-react";
import { DonutChart, SimpleBarChart, StackedBarChart } from "@/components/admin/charts";
import { STATUTS, statut as statutInfo } from "@/components/admin/status";
import { Badge, Button, DeltaBadge, EmptyState, HeaderStat, HeroPanel, KpiCard, PageHeader, Panel, ShareList } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

interface Indicateurs {
  colis: number;
  chiffreAffaires: number;
  poids: number;
  volume: number;
}

interface Dashboard {
  jours: number;
  seuilAttente: number;
  total: number;
  periode: Indicateurs;
  precedente: Indicateurs;
  statuts: { name: string; value: number }[];
  services: { name: string; value: number }[];
  pays: { name: string; value: number }[];
  mensuel: { name: string; aerien: number; maritime: number; chiffreAffaires: number }[];
  aTraiter: { attenteLongue: number; recusAExpedier: number; sansPrix: number; aRetirer: number };
  recents: { id: string; nom: string; status: string; service: string; prix: number | null; codeTracking: string | null; createdAt: string }[];
}

const PERIODES = [
  { jours: 30, label: "30 jours" },
  { jours: 90, label: "3 mois" },
  { jours: 365, label: "12 mois" },
];

const COULEUR_AERIEN = "#2a78d6";
const COULEUR_MARITIME = "#adc8e6";
const COULEURS_PAYS = ["#ec7a1c", "#2a78d6", "#10b981", "#8b5cf6"];

const nombre = (n: number, decimales = 0) => n.toLocaleString("fr-FR", { maximumFractionDigits: decimales });
/** Montant compact : 850 000 → « 850 k », 12 400 000 → « 12,4 M ». */
const compact = (n: number) =>
  n >= 1_000_000 ? `${nombre(n / 1_000_000, 1)} M` : n >= 10_000 ? `${nombre(n / 1_000)} k` : nombre(n);
const fcfa = (n: number) => `${compact(n)} FCFA`;
const evolution = (cur: number, prev: number) => (prev === 0 ? null : (cur - prev) / prev);
const formatPays = (pays: string) => (pays === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : pays === "MALI" ? "Mali" : pays);
const lienStatut = (s: string) => `/adresses?statut=${encodeURIComponent(s)}`;

export default function TableauDeBordPage() {
  const router = useRouter();
  const [jours, setJours] = useState(30);
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const charger = async (j = jours) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?jours=${j}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError("");
    } catch {
      setError("Erreur lors du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger(jours);
  }, [jours]);

  const libellePeriode = PERIODES.find((p) => p.jours === jours)!.label;
  const aujourdhui = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <PageHeader
        title="Tableau de bord"
        actions={
          <>
            <div role="tablist" aria-label="Période" className="inline-flex h-8 items-center rounded-lg bg-slate-900/[0.06] p-[3px]">
              {PERIODES.map((p) => (
                <button
                  key={p.jours}
                  role="tab"
                  aria-selected={jours === p.jours}
                  onClick={() => setJours(p.jours)}
                  className={cn(
                    "inline-flex h-full items-center rounded-md px-2.5 text-[13px] font-medium whitespace-nowrap transition-all",
                    jours === p.jours ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => charger()}
              disabled={loading}
              aria-label="Actualiser"
              icon={<RefreshCw className={cn("size-4", loading && "animate-spin")} />}
            />
          </>
        }
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {!data ? (
        <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
          <Loader2 className="size-4 animate-spin" />
          Chargement du tableau de bord…
        </div>
      ) : (
        <Contenu data={data} libellePeriode={libellePeriode} aujourdhui={aujourdhui} />
      )}
    </div>
  );
}

function Contenu({ data, libellePeriode, aujourdhui }: { data: Dashboard; libellePeriode: string; aujourdhui: string }) {
  const { periode: p, precedente: prev } = data;
  const parStatut = STATUTS.map((s) => ({
    name: s.label,
    value: data.statuts.find((x) => x.name === s.value)?.value ?? 0,
    color: s.color,
    href: lienStatut(s.value),
  }));
  const enCours = parStatut.slice(0, 3).reduce((t, s) => t + s.value, 0);
  const comparaison = `vs ${libellePeriode} précédents`;
  const hint = (delta: number | null) => (delta == null ? "Pas de données sur la période précédente" : comparaison);

  const aTraiter = [
    {
      label: `En attente de réception depuis plus de ${data.seuilAttente} jours`,
      value: data.aTraiter.attenteLongue,
      color: "bg-red-400",
      href: lienStatut("En attente de réception"),
    },
    { label: "Colis reçus à expédier", value: data.aTraiter.recusAExpedier, color: "bg-blue-400", href: lienStatut("Colis reçu") },
    { label: "Colis reçus ou envoyés sans prix", value: data.aTraiter.sansPrix, color: "bg-amber-400", href: "/adresses" },
    { label: "Arrivés à Abidjan, à retirer", value: data.aTraiter.aRetirer, color: "bg-violet-400", href: lienStatut("Arrive à Abidjan") },
  ];
  const maxATraiter = Math.max(1, ...aTraiter.map((a) => a.value));

  const colis12 = data.mensuel.reduce((t, m) => t + m.aerien + m.maritime, 0);
  const aerien12 = data.mensuel.reduce((t, m) => t + m.aerien, 0);
  const ca12 = data.mensuel.reduce((t, m) => t + m.chiffreAffaires, 0);
  const totalPays = data.pays.reduce((t, x) => t + x.value, 0);

  return (
    <>
      {/* Accueil + indicateurs de la période */}
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
        <HeroPanel className="lg:col-span-4">
          <div className="mb-4 space-y-1">
            <p className="text-2xl font-semibold text-slate-900">Bonjour 👋</p>
            <p className="text-slate-500 first-letter:uppercase">{aujourdhui}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium text-slate-500">Colis en cours</p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{nombre(enCours)}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                sur {nombre(data.total)} au total, <span className="font-medium text-violet-700">{nombre(data.aTraiter.aRetirer)}</span> à retirer
              </p>
            </div>
            <Link
              href="/sms"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <MessageSquareText className="size-3.5" />
              SMS groupés
            </Link>
          </div>
        </HeroPanel>

        <div className="grid gap-4 md:grid-cols-3 lg:col-span-8 lg:gap-6">
          <KpiCard
            title="Colis enregistrés"
            value={nombre(p.colis)}
            badge={<DeltaBadge delta={evolution(p.colis, prev.colis)} />}
            hint={hint(evolution(p.colis, prev.colis))}
            href="/adresses"
            linkLabel="Voir les colis"
          />
          <KpiCard
            title="Chiffre d'affaires"
            value={fcfa(p.chiffreAffaires)}
            badge={<DeltaBadge delta={evolution(p.chiffreAffaires, prev.chiffreAffaires)} />}
            hint={hint(evolution(p.chiffreAffaires, prev.chiffreAffaires))}
            href="/adresses"
            linkLabel="Prix des colis"
          />
          <KpiCard
            title="Fret"
            value={
              <span className="flex items-baseline gap-3">
                <span>
                  {nombre(p.poids, 1)}
                  <span className="ml-1 text-base font-medium text-slate-500">kg</span>
                </span>
                <span className="text-slate-300">·</span>
                <span>
                  {nombre(p.volume, 2)}
                  <span className="ml-1 text-base font-medium text-slate-500">CBM</span>
                </span>
              </span>
            }
            hint="Poids aérien · volume maritime"
            href="/adresses"
            linkLabel="Détail par colis"
          />
        </div>
      </div>

      {/* Suivi + à traiter */}
      <div className="grid gap-4 lg:gap-6 xl:grid-cols-2">
        <Panel title="Suivi des colis" info="Tous les colis, selon leur statut actuel">
          <DonutChart data={parStatut} centerLabel="colis" />
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {parStatut.map((s) => (
              <Link key={s.name} href={s.href} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.name}
                <span className="tabular-nums text-slate-400">{nombre(s.value)}</span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="À traiter" description="Colis qui demandent une action">
          <div className="space-y-4">
            {aTraiter.map((a) => (
              <Link key={a.label} href={a.href} className="group block space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-700 group-hover:text-slate-900">{a.label}</span>
                  <span className="flex items-center gap-1 font-semibold tabular-nums text-slate-900">
                    {nombre(a.value)}
                    <ChevronRight className="size-3.5 text-slate-400 group-hover:text-slate-700" />
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                  <div className={cn("h-full rounded-full", a.color)} style={{ width: `${(a.value / maxATraiter) * 100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* Graphiques mensuels */}
      <div className="grid gap-4 lg:gap-6 xl:grid-cols-2">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">{nombre(colis12)}</span>
              <span className="text-sm font-normal text-slate-500">colis sur 12 mois</span>
            </span>
          }
          actions={
            <div className="flex items-center gap-4">
              <HeaderStat label="Aérien" value={nombre(aerien12)} color={COULEUR_AERIEN} />
              <HeaderStat label="Maritime" value={nombre(colis12 - aerien12)} color={COULEUR_MARITIME} />
            </div>
          }
        >
          <StackedBarChart
            data={data.mensuel}
            series={[
              { key: "aerien", label: "Aérien", color: COULEUR_AERIEN },
              { key: "maritime", label: "Maritime", color: COULEUR_MARITIME },
            ]}
          />
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <span className="text-2xl font-semibold tabular-nums tracking-tight">{fcfa(ca12)}</span>
              <span className="text-sm font-normal text-slate-500">sur 12 mois</span>
            </span>
          }
          info="Somme des prix des colis, par mois d'enregistrement"
        >
          <SimpleBarChart data={data.mensuel} dataKey="chiffreAffaires" label="Chiffre d'affaires" color="#ec7a1c" format={compact} />
        </Panel>
      </div>

      {/* Derniers colis + répartition */}
      <div className="grid gap-4 lg:gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          title="Derniers colis enregistrés"
          actions={
            <Link href="/adresses" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900">
              Tout voir <ArrowRight className="size-3" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {data.recents.length === 0 ? (
            <EmptyState title="Aucun colis enregistré" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm [&_td:first-child]:ps-4 [&_td:last-child]:pe-4 [&_th:first-child]:ps-4 [&_th:last-child]:pe-4">
                <thead>
                  <tr className="border-b border-slate-900/[0.07] text-[13px]">
                    <th className="h-10 px-2 font-medium text-slate-900">Client</th>
                    <th className="h-10 px-2 font-medium text-slate-900">Service</th>
                    <th className="h-10 px-2 font-medium text-slate-900">Statut</th>
                    <th className="h-10 px-2 text-right font-medium text-slate-900">Prix</th>
                    <th className="h-10 px-2 font-medium text-slate-900">Enregistré le</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recents.map((c) => {
                    const s = statutInfo(c.status);
                    return (
                      <tr key={c.id} className="border-b border-slate-900/[0.06] last:border-0">
                        <td className="px-2 py-3">
                          <div className="flex flex-col">
                            <span className="whitespace-nowrap font-medium text-slate-900">{c.nom}</span>
                            {c.codeTracking && <span className="font-mono text-xs text-slate-500">{c.codeTracking}</span>}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-slate-700">{c.service}</td>
                        <td className="px-2 py-3">
                          <Badge tone={s.tone} dot>
                            {s.label}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-right tabular-nums text-slate-700">
                          {c.prix ? `${nombre(c.prix)} XOF` : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Destinations" description={`Colis enregistrés sur ${libellePeriode}`}>
          {totalPays === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Aucun colis sur la période.</p>
          ) : (
            <ShareList
              items={data.pays.map((x, i) => ({ name: formatPays(x.name), value: x.value, color: COULEURS_PAYS[i % COULEURS_PAYS.length] }))}
              total={totalPays}
            />
          )}
          {data.services.length > 0 && (
            <>
              <div className="my-5 h-px bg-slate-900/[0.07]" />
              <ShareList
                items={data.services.map((x) => ({
                  name: x.name,
                  value: x.value,
                  color: /maritime/i.test(x.name) ? COULEUR_MARITIME : COULEUR_AERIEN,
                }))}
                total={data.services.reduce((t, x) => t + x.value, 0)}
              />
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
