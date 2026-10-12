"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, RotateCcw, Send, Users } from "lucide-react";
import { Badge, Button, EmptyState, Field, Input, PageHeader, Panel, SearchInput, Select, Textarea } from "@/components/admin/ui";
import { STATUTS, statut as statutInfo } from "@/components/admin/status";
import {
  MOTIFS_RETARD,
  SELECTION_KEY,
  TYPES_SMS,
  aujourdhui,
  compterSms,
  modeleSms,
  personnaliser,
  type ResultatSms,
  type TypeSms,
} from "@/components/admin/sms";
import { cn } from "@/lib/utils";

interface Adresse {
  id: string;
  nom: string;
  tel: string;
  status: string;
  service: string;
  codeTracking: string | null;
}

const fmt = (n: number) => n.toLocaleString("fr-FR");
const pluriel = (n: number, mot: string) => `${fmt(n)} ${mot}${n > 1 ? "s" : ""}`;

const selectCls =
  "h-7 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-800 focus:border-brand-500 focus:outline-none";

export default function SmsGroupesPage() {
  const router = useRouter();

  // Destinataires
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState("");
  const [filterService, setFilterService] = useState("");
  const [search, setSearch] = useState("");

  // Message
  const [type, setType] = useState<TypeSms>("depart");
  const [depart, setDepart] = useState(aujourdhui);
  const [arrivee, setArrivee] = useState("");
  // Motif du retard : un motif proposé, « autre » (texte libre) ou aucun
  const [motifChoix, setMotifChoix] = useState("");
  const [motifLibre, setMotifLibre] = useState("");
  const motif = motifChoix === "autre" ? motifLibre : motifChoix;
  const [message, setMessage] = useState("");
  const [majStatut, setMajStatut] = useState(true);

  // Envoi
  const [confirmer, setConfirmer] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [resultat, setResultat] = useState<ResultatSms | null>(null);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/adresses");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error();
      setAdresses(await res.json());
      setLoadError("");
    } catch {
      setLoadError("Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
    // Sélection faite depuis la liste des adresses
    try {
      const raw = sessionStorage.getItem(SELECTION_KEY);
      if (raw) {
        setSelected(new Set(JSON.parse(raw) as string[]));
        sessionStorage.removeItem(SELECTION_KEY);
      }
    } catch {
      // stockage indisponible : pas de présélection
    }
  }, []);

  // Le texte est régénéré quand le type ou les informations changent
  useEffect(() => {
    setMessage(modeleSms(type, { depart, arrivee, motif }));
  }, [type, depart, arrivee, motif]);

  // Toute modification annule la confirmation en attente
  useEffect(() => {
    setConfirmer(false);
  }, [message, selected, majStatut]);

  const services = useMemo(() => Array.from(new Set(adresses.map((a) => a.service).filter(Boolean))).sort(), [adresses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return adresses.filter(
      (a) =>
        (!filterStatus || a.status === filterStatus) &&
        (!filterService || a.service === filterService) &&
        (!q ||
          a.nom.toLowerCase().includes(q) ||
          a.tel.toLowerCase().includes(q) ||
          (a.codeTracking ?? "").toLowerCase().includes(q))
    );
  }, [adresses, filterStatus, filterService, search]);

  const destinataires = adresses.filter((a) => selected.has(a.id));
  const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleFiltered = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const a of filtered) {
        if (allFilteredSelected) next.delete(a.id);
        else next.add(a.id);
      }
      return next;
    });

  const typeInfo = TYPES_SMS.find((t) => t.value === type)!;
  const premier = destinataires[0];
  const apercu = premier ? personnaliser(message, premier) : message.replace(/\{nom\}/g, "Nom du client").replace(/\{code\}/g, "RC00000");
  const compte = useMemo(() => compterSms(apercu), [apercu]);
  const statutCible = typeInfo.statut && majStatut ? typeInfo.statut : undefined;
  const n = destinataires.length;

  const envoyer = async () => {
    if (!confirmer) {
      setConfirmer(true);
      return;
    }
    setEnvoi(true);
    setErreur("");
    try {
      const res = await fetch("/api/sms/masse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: destinataires.map((d) => d.id), message, statut: statutCible }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErreur(data?.error ?? "Erreur lors de l'envoi");
        setConfirmer(false);
        return;
      }
      setResultat(data);
      setSelected(new Set());
      if (data.misAJour > 0) charger();
    } catch {
      setErreur("Erreur réseau lors de l'envoi");
      setConfirmer(false);
    } finally {
      setEnvoi(false);
    }
  };

  const nouvelEnvoi = () => {
    setResultat(null);
    setErreur("");
    setConfirmer(false);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <PageHeader
        title="SMS groupés"
        subtitle="Prévenez plusieurs clients en une fois : départ des colis, retard, arrivée à Abidjan."
      />

      {loadError && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </p>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          {/* 1. Destinataires */}
          <Panel
            title="1. Destinataires"
            description="Filtrez puis cochez les clients à prévenir."
            actions={
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-white px-2.5 text-xs font-medium text-slate-700 ring-1 ring-slate-900/10">
                <Users className="size-3.5" />
                {pluriel(n, "sélectionné")}
              </span>
            }
            bodyClassName="p-0"
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-900/[0.07] px-4 py-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Statut" className={selectCls}>
                <option value="">Tous les statuts</option>
                {STATUTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select value={filterService} onChange={(e) => setFilterService(e.target.value)} aria-label="Service" className={selectCls}>
                <option value="">Tous les services</option>
                {services.map((sv) => (
                  <option key={sv} value={sv}>
                    {sv}
                  </option>
                ))}
              </select>
              <SearchInput value={search} onChange={setSearch} placeholder="Nom, téléphone, code…" />
              {n > 0 && (
                <button onClick={() => setSelected(new Set())} className="ml-auto text-[13px] font-medium text-slate-500 hover:text-slate-900">
                  Vider la sélection
                </button>
              )}
            </div>

            {loading && adresses.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                Chargement des clients…
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState title="Aucun client">Modifiez les filtres ou la recherche.</EmptyState>
            ) : (
              <>
                <label className="flex cursor-pointer items-center gap-3 border-b border-slate-900/[0.07] px-4 py-2.5 text-[13px] font-medium text-slate-900 hover:bg-white">
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleFiltered} className="size-4 accent-brand-700" />
                  {allFilteredSelected ? "Désélectionner" : "Sélectionner"} les {pluriel(filtered.length, "client")} affiché{filtered.length > 1 ? "s" : ""}
                </label>
                <ul className="max-h-[26rem] overflow-y-auto">
                  {filtered.map((a) => {
                    const s = statutInfo(a.status);
                    const on = selected.has(a.id);
                    return (
                      <li key={a.id}>
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-3 border-b border-slate-900/[0.06] px-4 py-2.5 transition-colors",
                            on ? "bg-brand-50/70" : "hover:bg-white"
                          )}
                        >
                          <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="size-4 shrink-0 accent-brand-700" />
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium text-slate-900">{a.nom}</span>
                            <span className="truncate text-xs tabular-nums text-slate-500">
                              {a.tel} · {a.service}
                            </span>
                          </span>
                          {a.codeTracking && (
                            <span className="hidden rounded-md bg-slate-900/[0.05] px-1.5 py-0.5 font-mono text-xs text-slate-700 sm:inline">
                              {a.codeTracking}
                            </span>
                          )}
                          <Badge tone={s.tone} dot>
                            {s.label}
                          </Badge>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </Panel>

          {/* 2. Message */}
          <Panel title="2. Message" description="Choisissez un modèle, complétez-le si besoin.">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TYPES_SMS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    aria-pressed={type === t.value}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition-colors",
                      type === t.value ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <span className="block text-[13px] font-medium text-slate-900">{t.label}</span>
                    <span className="block text-[11px] leading-tight text-slate-500">{t.description}</span>
                  </button>
                ))}
              </div>

              {type === "depart" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Date de départ">
                    <Input type="date" value={depart} onChange={(e) => setDepart(e.target.value)} />
                  </Field>
                  <Field label="Arrivée prévue">
                    <Input type="date" value={arrivee} onChange={(e) => setArrivee(e.target.value)} />
                  </Field>
                </div>
              )}
              {type === "retard" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nouvelle date d'arrivée">
                    <Input type="date" value={arrivee} onChange={(e) => setArrivee(e.target.value)} />
                  </Field>
                  <Field label="Motif du retard">
                    <Select
                      value={motifChoix}
                      onChange={(e) => setMotifChoix(e.target.value)}
                      options={[...MOTIFS_RETARD, { value: "autre", label: "Autre (préciser)…" }]}
                      placeholder="Sans motif"
                    />
                  </Field>
                  {motifChoix === "autre" && (
                    <Field label="Précisez le motif" className="sm:col-span-2" hint="Évitez les caractères comme ô, ç ou les emoji : ils réduisent la taille du SMS.">
                      <Input
                        value={motifLibre}
                        onChange={(e) => setMotifLibre(e.target.value)}
                        placeholder="ex. Escale imprévue du navire à Dakar"
                        maxLength={120}
                        autoFocus
                      />
                    </Field>
                  )}
                </div>
              )}

              <Field
                label="Texte du SMS"
                hint={
                  <>
                    <code className="rounded bg-slate-900/[0.05] px-1">{"{nom}"}</code> et{" "}
                    <code className="rounded bg-slate-900/[0.05] px-1">{"{code}"}</code> sont remplacés pour chaque client. Changer le modèle
                    ou une date réécrit le texte.
                  </>
                }
              >
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={12} className="font-mono text-[13px]" />
              </Field>

              {typeInfo.statut && (
                <label className="flex items-start gap-2 text-[13px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={majStatut}
                    onChange={(e) => setMajStatut(e.target.checked)}
                    className="mt-0.5 size-4 accent-brand-700"
                  />
                  <span>
                    Passer aussi les colis sélectionnés au statut <strong>« {statutInfo(typeInfo.statut).label} »</strong>
                    <span className="block text-xs text-slate-500">Sans envoyer le SMS de changement de statut habituel.</span>
                  </span>
                </label>
              )}
            </div>
          </Panel>
        </div>

        {/* Aperçu et envoi */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:gap-6">
          <Panel title="Aperçu" description={premier ? `Tel que reçu par ${premier.nom}` : "Exemple de message"}>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2.5 text-[13px] leading-snug whitespace-pre-wrap text-slate-800">
              {apercu}
            </div>
            <p className={cn("mt-2 text-xs tabular-nums", compte.parties > 3 || compte.horsGsm.length ? "text-amber-800" : "text-slate-500")}>
              {compte.longueur} caractères · {fmt(compte.parties)} SMS par client
            </p>
            {compte.horsGsm.length > 0 && (
              <p className="mt-1 text-xs text-amber-800">
                Caractères spéciaux ({compte.horsGsm.map((c) => (c === "\n" ? "↵" : c)).join(" ")}) : le SMS passe en Unicode, 70 caractères
                par partie.
              </p>
            )}
          </Panel>

          <Panel title="3. Envoi">
            {resultat ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="font-medium">{pluriel(resultat.envoyes, "SMS envoyé")}</p>
                    {resultat.misAJour > 0 && <p>{fmt(resultat.misAJour)} colis mis à jour.</p>}
                  </div>
                </div>
                {resultat.echecs.length > 0 && (
                  <div className="rounded-lg bg-red-50 px-3 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
                    <p className="mb-2 flex items-center gap-2 font-medium">
                      <AlertTriangle className="size-4" />
                      {pluriel(resultat.echecs.length, "échec")}
                    </p>
                    <ul className="max-h-48 space-y-1 overflow-y-auto">
                      {resultat.echecs.map((e, i) => (
                        <li key={i}>
                          <span className="font-medium">{e.nom}</span> ({e.tel}) : {e.erreur}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button variant="secondary" className="w-full" onClick={nouvelEnvoi} icon={<RotateCcw className="size-4" />}>
                  Nouvel envoi
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <dl className="space-y-1.5 text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Destinataires</dt>
                    <dd className="font-medium tabular-nums text-slate-900">{fmt(n)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">SMS facturés (environ)</dt>
                    <dd className="font-medium tabular-nums text-slate-900">{fmt(n * compte.parties)}</dd>
                  </div>
                  {statutCible && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Nouveau statut</dt>
                      <dd className="text-right font-medium text-slate-900">{statutInfo(statutCible).label}</dd>
                    </div>
                  )}
                </dl>

                {erreur && (
                  <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    {erreur}
                  </p>
                )}
                {confirmer && !envoi && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    {fmt(n)} SMS vont partir immédiatement. Cliquez à nouveau pour confirmer.
                  </p>
                )}
                {n === 0 && <p className="text-xs text-slate-500">Cochez au moins un client dans la liste.</p>}

                <div className="flex gap-2">
                  {confirmer && !envoi && (
                    <Button variant="secondary" onClick={() => setConfirmer(false)}>
                      Annuler
                    </Button>
                  )}
                  <Button
                    variant={confirmer ? "accent" : "primary"}
                    className="flex-1"
                    onClick={envoyer}
                    disabled={envoi || n === 0 || !message.trim()}
                    icon={envoi ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  >
                    {envoi ? "Envoi en cours…" : confirmer ? "Confirmer l'envoi" : `Envoyer à ${pluriel(n, "client")}`}
                  </Button>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
