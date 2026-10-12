"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Ellipsis,
  MessageSquareText,
  X,
  Loader2,
  Package,
  PackageCheck,
  Plane,
  RefreshCw,
  Timer,
  MapPin,
} from "lucide-react";
import EditAdresseModal from "@/components/EditAdresseModal";
import { SELECTION_KEY } from "@/components/admin/sms";
import { Badge, Button, ConfirmDialog, EmptyState, Frame, Kpi, PageHeader, SearchInput } from "@/components/admin/ui";
import { STATUTS, statut } from "@/components/admin/status";
import { cn } from "@/lib/utils";

interface Adresse {
  id: string;
  nom: string;
  tel: string;
  email: string | null;
  pays: string;
  type: string;
  status: string;
  date: string | null;
  description: string;
  service: string;
  poids: number | null;
  volume: number | null;
  prix: number | null;
  images: { id: string; url: string }[];
  codeTracking: string;
  etat: string;
  createdAt?: string;
}

type SortKey = "nom" | "service" | "status" | "poids" | "prix" | "createdAt";

const PAGE_SIZES = [10, 25, 50, 100];
const KPI_ICONS = [Timer, PackageCheck, Plane, MapPin];
const KPI_TONES = ["amber", "brand", "green", "violet"] as const;

const formatPays = (pays: string) =>
  pays === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : pays === "MALI" ? "Mali" : pays;
const formatNombre = (n: number) => n.toLocaleString("fr-FR");
const formatDateCourte = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function AdressesPage() {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAdresse, setSelectedAdresse] = useState<Adresse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Adresse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterService, setFilterService] = useState<string>("");
  // Sélection pour l'envoi de SMS de masse
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  useEffect(() => {
    fetchAdresses();
    // Filtre reçu par lien (ex. depuis le tableau de bord : /adresses?statut=Colis reçu)
    const statutUrl = new URLSearchParams(window.location.search).get("statut");
    if (statutUrl) setFilterStatus(statutUrl);
  }, []);

  // Retour à la première page quand la sélection change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterStatus, filterService, pageSize]);

  const sendSMS = async (phoneNumber: string, message: string) => {
    try {
      const response = await fetch("/api/bulksms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: `+225${phoneNumber}`, message }),
      });

      if (!response.ok) {
        throw new Error(`Erreur envoi SMS: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const filteredAdresses = useMemo(() => {
    let filtered = [...adresses];

    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (adresse) =>
          adresse.nom.toLowerCase().includes(searchLower) ||
          adresse.tel.toLowerCase().includes(searchLower) ||
          adresse.pays.toLowerCase().includes(searchLower) ||
          adresse.type.toLowerCase().includes(searchLower) ||
          adresse.service.toLowerCase().includes(searchLower) ||
          (adresse.codeTracking ?? "").toLowerCase().includes(searchLower)
      );
    }

    // Filtre par statut
    if (filterStatus) {
      filtered = filtered.filter((adresse) => adresse.status === filterStatus);
    }

    // Filtre par service (aérien / maritime)
    if (filterService) {
      filtered = filtered.filter((adresse) => adresse.service === filterService);
    }

    if (sort) {
      const dir = sort.dir === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        const va = a[sort.key];
        const vb = b[sort.key];
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "fr")) * dir;
      });
    }

    return filtered;
  }, [adresses, searchTerm, filterStatus, filterService, sort]);

  const services = useMemo(() => Array.from(new Set(adresses.map((a) => a.service).filter(Boolean))).sort(), [adresses]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of adresses) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [adresses]);

  const pages = Math.max(1, Math.ceil(filteredAdresses.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = filteredAdresses.slice(current * pageSize, (current + 1) * pageSize);

  // Sélection : seules les adresses encore présentes comptent
  const selectedRows = adresses.filter((a) => selected.has(a.id));
  const pageAllSelected = visible.length > 0 && visible.every((a) => selected.has(a.id));
  const pageSomeSelected = visible.some((a) => selected.has(a.id));
  const allFilteredSelected = filteredAdresses.length > 0 && filteredAdresses.every((a) => selected.has(a.id));
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const a of visible) {
        if (pageAllSelected) next.delete(a.id);
        else next.add(a.id);
      }
      return next;
    });

  // La sélection est reprise par la page « SMS groupés »
  const envoyerSms = () => {
    try {
      sessionStorage.setItem(SELECTION_KEY, JSON.stringify(selectedRows.map((a) => a.id)));
    } catch {
      // stockage indisponible : la sélection sera à refaire sur la page SMS
    }
    router.push("/sms");
  };

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const fetchAdresses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/adresses");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setAdresses(data);
        setError("");
      } else {
        setError("Erreur lors du chargement des adresses");
      }
    } catch (err) {
      setError("Erreur lors du chargement des adresses");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (adresse: Adresse) => {
    setSelectedAdresse(adresse);
    setIsEditModalOpen(true);
  };

  const handleSave = async (data: {
    status: string;
    poids: number | null;
    prix: number | null;
    volume: number | null;
    nombreColis: number | null;
    dateArrivee: string | null;
    images?: File[];
  }) => {
    if (!selectedAdresse) return;

    try {
      const formData = new FormData();
      formData.append("status", data.status);
      if (data.poids) formData.append("poids", data.poids.toString());
      if (data.prix) formData.append("prix", data.prix.toString());
      if (data.volume) formData.append("volume", data.volume.toString());
      if (data.images) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await fetch(`/api/adresses/${selectedAdresse.id}`, {
        method: "PATCH",
        body: formData,
      });


      const dataresponse = await response.json();

      if (response.ok) {
        fetchAdresses();
        setIsEditModalOpen(false);
        setSelectedAdresse(null);
      } else {
        setError("Erreur lors de la modification");
      }


      if (response.ok && dataresponse) {
        // Pas d'emoji ni de caractères hors GSM-7 : sinon le SMS passe en Unicode
        // (70 caractères par partie) et l'opérateur rejette les messages longs.
        const formatPrix = (prix: number) =>
          prix.toLocaleString("fr-FR").replace(/[\u00a0\u202f]/g, " ");

        const formatDate = (date: Date) => date.toLocaleDateString("fr-FR");
        const dateArrivee = data.dateArrivee
          ? data.dateArrivee.split("-").reverse().join("/")
          : null;

        const depart = formatDate(new Date());
        const prixLigne = dataresponse.prix
          ? `Prix : ${formatPrix(dataresponse.prix)} FCFA\n`
          : "";
        const arriveeLigne = dateArrivee ? `Arrivée prévue : ${dateArrivee}\n` : "";
        const ligneDetails = (details: (string | null)[]) => {
          const ligne = details.filter(Boolean).join(" | ");
          return ligne ? `${ligne}\n` : "";
        };

        if (
          dataresponse.status === "Colis envoye" &&
          dataresponse.service === "Envoie Maritime"
        ) {
          // Message de départ bateau
          sendSMS(
            dataresponse.tel,
            `ROYAL CARGO

M/MME ${dataresponse.nom},

Vos colis ont quitté la Chine le ${depart}.

${ligneDetails([
  data.nombreColis ? `Colis : ${data.nombreColis}` : null,
  dataresponse.volume ? `CBM : ${dataresponse.volume}` : null,
])}${prixLigne}${arriveeLigne}
Tout retard vous sera signalé par message.

Retrait sous 5 jours après arrivée, sinon frais de magasinage de 5 000 à 30 000 FCFA par jour.

Service client Abidjan : 07 02 67 02 02
royalcargor225.com

Merci pour votre confiance.`
          );
        } else if (dataresponse.status === "Colis envoye") {
          // Message de départ avion
          sendSMS(
            dataresponse.tel,
            `M/MME ${dataresponse.nom},

Vos colis ont quitté la Chine le ${depart}.

${ligneDetails([
  data.nombreColis ? `Colis : ${data.nombreColis}` : null,
  dataresponse.poids ? `Poids : ${dataresponse.poids} kg` : null,
])}${prixLigne}${arriveeLigne}
Tout retard vous sera signalé par message.

Retrait sous 5 jours après arrivée, sinon frais de magasinage de 5 000 à 30 000 FCFA par jour.

Chine : +86 185 6553 7490 | Abidjan : +225 05 85 32 79 10

Merci pour votre confiance.
ROYAL CARGO`
          );
        } else {
          sendSMS(
            dataresponse?.tel,
            `ROYAL CARGO \nBONJOUR CHER CLIENT (${dataresponse.nom}). NOUS SOMMES RAVIS DE VOUS ANNONCER QUE LE STATUT DE VOTRE COLIS À CHANGER, IL EST MAINTENANT PASSER À **${dataresponse.status.toUpperCase()}**.\nPOUR PLUS DE DÉTAILS RENDEZ-VOUS sur royalcargor225.com AVEC VOTRE NUMÉRO DE SUIVI: ${dataresponse.codeTracking}`
          );
        }
      }

    } catch (err) {
      setError("Erreur lors de la modification");
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdresses();
      } else {
        setError("Erreur lors de la suppression de l'image");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'image");
    }
  };

  const handleDelete = async (id: string) => {
    setToDelete(null);
    try {
      const response = await fetch(`/api/adresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdresses();
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const columns: { key: string; header: string; sort?: SortKey; align?: "right" }[] = [
    { key: "nom", header: "Client", sort: "nom" },
    { key: "pays", header: "Pays" },
    { key: "type", header: "Type" },
    { key: "service", header: "Service", sort: "service" },
    { key: "status", header: "Statut", sort: "status" },
    { key: "poids", header: "Poids", sort: "poids", align: "right" },
    { key: "prix", header: "Prix", sort: "prix", align: "right" },
    { key: "code", header: "Code" },
    { key: "createdAt", header: "Créé le", sort: "createdAt" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <PageHeader
        title="Colis & adresses"
        subtitle={loading ? "Chargement…" : `${formatNombre(adresses.length)} enregistrement${adresses.length > 1 ? "s" : ""}`}
        actions={
          <Button
            variant="secondary"
            onClick={fetchAdresses}
            disabled={loading}
            icon={<RefreshCw className={cn("size-4", loading && "animate-spin")} />}
          >
            Actualiser
          </Button>
        }
      />

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {/* Indicateurs : un clic filtre la liste sur le statut */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
        <Kpi
          label="Total"
          value={formatNombre(adresses.length)}
          hint="Tous statuts"
          icon={<Package />}
          onClick={() => setFilterStatus("")}
          active={filterStatus === ""}
        />
        {STATUTS.map((s, i) => {
          const Icon = KPI_ICONS[i];
          return (
            <Kpi
              key={s.value}
              label={s.label}
              value={formatNombre(counts[s.value] ?? 0)}
              hint={adresses.length ? `${Math.round(((counts[s.value] ?? 0) / adresses.length) * 100)} % du total` : undefined}
              icon={<Icon />}
              tone={KPI_TONES[i]}
              onClick={() => setFilterStatus(filterStatus === s.value ? "" : s.value)}
              active={filterStatus === s.value}
            />
          );
        })}
      </div>

      <Frame>
        {/* Barre d'outils : actions sur la sélection, sinon onglets de statut et recherche */}
        {selectedRows.length > 0 ? (
          <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-slate-900/[0.07] bg-brand-50/60 px-4 py-3">
            <span className="text-sm font-medium text-slate-900">
              {selectedRows.length} sélectionné{selectedRows.length > 1 ? "s" : ""}
            </span>
            <Button size="sm" onClick={envoyerSms} icon={<MessageSquareText className="size-3.5" />}>
              Envoyer un SMS
            </Button>
            {!allFilteredSelected && (
              <button
                onClick={() => setSelected(new Set([...Array.from(selected), ...filteredAdresses.map((a) => a.id)]))}
                className="text-[13px] font-medium text-brand-700 hover:underline"
              >
                Sélectionner les {formatNombre(filteredAdresses.length)} résultats
              </button>
            )}
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto inline-flex h-7 items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <X className="size-3.5" />
              Désélectionner
            </button>
          </div>
        ) : (
        <div className="flex min-h-14 flex-wrap items-center gap-2 border-b border-slate-900/[0.07] px-4 py-3">
          <div className="hidden max-w-full overflow-x-auto md:block">
            <div role="tablist" className="inline-flex h-8 items-center rounded-lg bg-slate-900/[0.06] p-[3px]">
              {[{ value: "", label: "Tous" }, ...STATUTS].map((s) => {
                const active = filterStatus === s.value;
                return (
                  <button
                    key={s.value || "tous"}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilterStatus(s.value)}
                    className={cn(
                      "inline-flex h-full items-center rounded-md px-2.5 text-[13px] font-medium whitespace-nowrap transition-all",
                      active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Sur mobile, les onglets laissent place à une liste déroulante */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Statut"
            className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-800 focus:border-brand-500 focus:outline-none md:hidden"
          >
            <option value="">Tous les statuts</option>
            {STATUTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {services.length > 1 && (
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              aria-label="Service"
              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[13px] text-slate-800 focus:border-brand-500 focus:outline-none"
            >
              <option value="">Tous les services</option>
              {services.map((sv) => (
                <option key={sv} value={sv}>
                  {sv}
                </option>
              ))}
            </select>
          )}
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Nom, téléphone, pays, service, code…" />
          <span className="ml-auto text-[13px] text-slate-500 tabular-nums">
            {formatNombre(filteredAdresses.length)} résultat{filteredAdresses.length > 1 ? "s" : ""}
          </span>
        </div>
        )}

        {loading && adresses.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
            <Loader2 className="size-4 animate-spin" />
            Chargement des adresses…
          </div>
        ) : filteredAdresses.length === 0 ? (
          <EmptyState title="Aucun résultat">
            {searchTerm || filterStatus ? "Modifiez la recherche ou le filtre de statut." : "Aucune adresse enregistrée pour le moment."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm [&_td:first-child]:ps-4 [&_td:last-child]:pe-4 [&_th:first-child]:ps-4 [&_th:last-child]:pe-4">
              <thead>
                <tr className="border-b border-slate-900/[0.07]">
                  <th className="h-10 w-8 px-2">
                    <Checkbox
                      checked={pageAllSelected}
                      indeterminate={!pageAllSelected && pageSomeSelected}
                      onChange={togglePage}
                      label="Sélectionner les lignes de la page"
                    />
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={cn("h-10 whitespace-nowrap px-2 align-middle font-medium text-slate-900", c.align === "right" && "text-right")}
                    >
                      {c.sort ? (
                        <button
                          onClick={() => toggleSort(c.sort!)}
                          className={cn(
                            "inline-flex h-7 items-center gap-1 rounded-md px-2 text-[13px] font-medium hover:bg-slate-900/5",
                            c.align === "right" ? "-me-2" : "-ms-2"
                          )}
                        >
                          {c.header}
                          {sort?.key === c.sort ? (
                            sort.dir === "asc" ? (
                              <ArrowUp className="size-3.5 text-brand-600" />
                            ) : (
                              <ArrowDown className="size-3.5 text-brand-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[13px]">{c.header}</span>
                      )}
                    </th>
                  ))}
                  <th className="h-10 w-10 px-2" />
                </tr>
              </thead>
              <tbody>
                {visible.map((adresse) => {
                  const s = statut(adresse.status);
                  return (
                    <tr
                      key={adresse.id}
                      onClick={() => handleEdit(adresse)}
                      className={cn(
                        "cursor-pointer border-b border-slate-900/[0.06] transition-colors last:border-0",
                        selected.has(adresse.id) ? "bg-brand-50/70" : "hover:bg-white"
                      )}
                    >
                      <td className="w-8 px-2 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(adresse.id)} onChange={() => toggleRow(adresse.id)} label={`Sélectionner ${adresse.nom}`} />
                      </td>
                      <td className="px-2 py-3 align-middle">
                        <div className="flex min-w-0 flex-col">
                          <span className="whitespace-nowrap font-medium text-slate-900">{adresse.nom}</span>
                          <span className="whitespace-nowrap text-xs text-slate-500 tabular-nums">{adresse.tel}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-slate-700">{formatPays(adresse.pays)}</td>
                      <td className="whitespace-nowrap px-2 py-3 text-slate-700">{adresse.type}</td>
                      <td className="whitespace-nowrap px-2 py-3 text-slate-700">{adresse.service}</td>
                      <td className="px-2 py-3">
                        <Badge tone={s.tone} dot>
                          {s.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-right tabular-nums text-slate-700">
                        {adresse.poids ? `${adresse.poids} kg` : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-right tabular-nums text-slate-700">
                        {adresse.prix ? `${formatNombre(adresse.prix)} XOF` : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3">
                        {adresse.codeTracking ? (
                          <span className="rounded-md bg-slate-900/[0.05] px-1.5 py-0.5 font-mono text-xs text-slate-700">{adresse.codeTracking}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-slate-500">{formatDateCourte(adresse.createdAt)}</td>
                      <td className="w-10 px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <RowMenu onEdit={() => handleEdit(adresse)} onDelete={() => setToDelete(adresse)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredAdresses.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-900/[0.07] px-4 py-3 sm:flex-row">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              Lignes par page
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-7 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 tabular-nums">
                {current * pageSize + 1} – {current * pageSize + visible.length} sur {filteredAdresses.length}
              </span>
              <div className="flex items-center gap-1">
                <PageButton disabled={current === 0} onClick={() => setPage(current - 1)} label="Page précédente">
                  <ChevronLeft className="size-4" />
                </PageButton>
                {pageList(current, pages).map((p, i) =>
                  p === null ? (
                    <span key={`e${i}`} className="w-7 text-center text-slate-400">
                      …
                    </span>
                  ) : (
                    <PageButton key={p} active={p === current} onClick={() => setPage(p)} label={`Page ${p + 1}`}>
                      {p + 1}
                    </PageButton>
                  )
                )}
                <PageButton disabled={current >= pages - 1} onClick={() => setPage(current + 1)} label="Page suivante">
                  <ChevronRight className="size-4" />
                </PageButton>
              </div>
            </div>
          </div>
        )}
      </Frame>

      {selectedAdresse && (
        <EditAdresseModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdresse(null);
          }}
          adresse={selectedAdresse}
          onSave={handleSave}
          onImageDelete={handleImageDelete}
        // onSMS={sendSMS}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer l'adresse"
        message={
          <>
            Supprimer définitivement l&apos;adresse de <strong className="text-slate-900">{toDelete?.nom}</strong> ? Cette action est irréversible.
          </>
        }
        onConfirm={() => toDelete && handleDelete(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}

function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  return (
    <input
      ref={(el) => {
        if (el) el.indeterminate = !!indeterminate;
      }}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 cursor-pointer rounded border-slate-300 align-middle accent-brand-700"
    />
  );
}

/** Pages à afficher : toujours la première, la dernière et les voisines de la page courante. */
function pageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const keep = new Set([0, total - 1, current - 1, current, current + 1].filter((p) => p >= 0 && p < total));
  const out: (number | null)[] = [];
  for (const p of Array.from(keep).sort((a, b) => a - b)) {
    if (out.length && p - (out[out.length - 1] as number) > 1) out.push(null);
    out.push(p);
  }
  return out;
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40",
        active ? "border border-slate-300 bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-900/5"
      )}
    >
      {children}
    </button>
  );
}

/** Menu « … » d'une ligne, positionné en fixe pour ne pas être coupé par le défilement du tableau. */
function RowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const item = "block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] hover:bg-slate-900/5";
  return (
    <>
      <button
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos(pos ? null : { top: r.bottom + 4, right: window.innerWidth - r.right });
        }}
        aria-label="Actions"
        aria-expanded={!!pos}
        className="inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-900/5 hover:text-slate-900"
      >
        <Ellipsis className="size-4" />
      </button>
      {pos && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setPos(null)} />
          <div className="fixed z-40 w-44 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg" style={{ top: pos.top, right: pos.right }}>
            <button
              className={cn(item, "text-slate-700")}
              onClick={() => {
                setPos(null);
                onEdit();
              }}
            >
              Modifier
            </button>
            <button
              className={cn(item, "text-red-600")}
              onClick={() => {
                setPos(null);
                onDelete();
              }}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </>
  );
}
