"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Eye, EyeOff, KeyRound, Loader2, Trash2, UserPlus, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, ConfirmDialog, EmptyState, Field, Input, Modal, PageHeader, Panel } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

interface Utilisateur {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const dateFr = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/** Mot de passe aléatoire lisible (sans caractères ambigus comme 0/O, 1/l). */
function genererMotDePasse(longueur = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const valeurs = crypto.getRandomValues(new Uint32Array(longueur));
  return Array.from(valeurs, (v) => chars[v % chars.length]).join("");
}

async function appel(url: string, init?: RequestInit) {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

export default function ParametresPage() {
  const router = useRouter();
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [moi, setMoi] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ajoutOpen, setAjoutOpen] = useState(false);
  const [aReinitialiser, setAReinitialiser] = useState<Utilisateur | null>(null);
  const [aSupprimer, setASupprimer] = useState<Utilisateur | null>(null);

  const charger = async () => {
    setLoading(true);
    const { ok, status, data } = await appel("/api/utilisateurs");
    if (status === 401) {
      router.push("/login");
      return;
    }
    if (ok) {
      setUsers(data.users);
      setMoi(data.moi);
      setError("");
    } else {
      setError(data?.error ?? "Erreur lors du chargement des utilisateurs");
    }
    setLoading(false);
  };

  useEffect(() => {
    charger();
  }, []);

  const supprimer = async (u: Utilisateur) => {
    setASupprimer(null);
    const { ok, data } = await appel(`/api/utilisateurs/${u.id}`, { method: "DELETE" });
    if (ok) {
      toast.success(`Compte ${u.email} supprimé`);
      charger();
    } else {
      toast.error(data?.error ?? "Erreur lors de la suppression");
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <PageHeader title="Paramètres" subtitle="Comptes du back office et mot de passe." />

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-6">
        <Panel
          title="Utilisateurs"
          description="Comptes autorisés à se connecter au back office. Tous ont les mêmes droits."
          actions={
            <Button size="sm" onClick={() => setAjoutOpen(true)} icon={<UserPlus className="size-3.5" />}>
              Ajouter
            </Button>
          }
          bodyClassName="p-0"
        >
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Chargement…
            </div>
          ) : users.length === 0 ? (
            <EmptyState title="Aucun utilisateur" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm [&_td:first-child]:ps-4 [&_td:last-child]:pe-4 [&_th:first-child]:ps-4 [&_th:last-child]:pe-4">
                <thead>
                  <tr className="border-b border-slate-900/[0.07]">
                    <th className="h-10 px-2 text-[13px] font-medium text-slate-900">Email</th>
                    <th className="h-10 px-2 text-[13px] font-medium whitespace-nowrap text-slate-900">Créé le</th>
                    <th className="h-10 px-2 text-[13px] font-medium whitespace-nowrap text-slate-900">Modifié le</th>
                    <th className="h-10 px-2" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const estMoi = u.id === moi;
                    return (
                      <tr key={u.id} className="border-b border-slate-900/[0.06] last:border-0 hover:bg-white">
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold uppercase text-brand-700">
                              {u.email.slice(0, 2)}
                            </span>
                            <span className="truncate font-medium text-slate-900">{u.email}</span>
                            {estMoi && (
                              <Badge tone="blue" dot>
                                Vous
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-slate-500">{dateFr(u.createdAt)}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-slate-500">{dateFr(u.updatedAt)}</td>
                        <td className="px-2 py-3">
                          <div className="flex justify-end gap-1">
                            {!estMoi && (
                              <>
                                <button
                                  onClick={() => setAReinitialiser(u)}
                                  title="Réinitialiser le mot de passe"
                                  aria-label={`Réinitialiser le mot de passe de ${u.email}`}
                                  className="inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-900/5 hover:text-slate-900"
                                >
                                  <KeyRound className="size-4" />
                                </button>
                                <button
                                  onClick={() => setASupprimer(u)}
                                  title="Supprimer"
                                  aria-label={`Supprimer ${u.email}`}
                                  className="inline-flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <MonMotDePasse />
      </div>

      <AjoutUtilisateur
        open={ajoutOpen}
        onClose={() => setAjoutOpen(false)}
        onCreated={(u) => {
          setAjoutOpen(false);
          toast.success(`Compte ${u.email} créé`);
          charger();
        }}
      />

      <ReinitialiserMotDePasse utilisateur={aReinitialiser} onClose={() => setAReinitialiser(null)} />

      <ConfirmDialog
        open={!!aSupprimer}
        title="Supprimer le compte"
        message={
          <>
            Le compte <strong className="text-slate-900">{aSupprimer?.email}</strong> ne pourra plus se connecter au back office.
          </>
        }
        onConfirm={() => aSupprimer && supprimer(aSupprimer)}
        onClose={() => setASupprimer(null)}
      />
    </div>
  );
}

/** Champ mot de passe avec bouton afficher / masquer et, en option, un générateur. */
function MotDePasseInput({
  value,
  onChange,
  generer,
  autoComplete,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  generer?: boolean;
  autoComplete: string;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required
          className="pr-9"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-700"
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {generer && (
        <Button
          variant="secondary"
          onClick={() => {
            onChange(genererMotDePasse());
            setVisible(true);
          }}
          icon={<Wand2 className="size-4" />}
          title="Générer un mot de passe"
        >
          <span className="hidden sm:inline">Générer</span>
        </Button>
      )}
    </div>
  );
}

function AjoutUtilisateur({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (u: Utilisateur) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setErreur("");
    }
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const { ok, data } = await appel("/api/utilisateurs", { method: "POST", body: JSON.stringify({ email, password }) });
    setPending(false);
    if (ok) onCreated(data);
    else setErreur(data?.error ?? "Erreur lors de la création");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Ajouter un utilisateur"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="ajout-utilisateur" disabled={pending} icon={pending ? <Loader2 className="size-4 animate-spin" /> : undefined}>
            Créer le compte
          </Button>
        </>
      }
    >
      <form id="ajout-utilisateur" onSubmit={submit} className="space-y-4">
        <Field label="Email" required>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" autoFocus required />
        </Field>
        <Field label="Mot de passe" required hint="8 caractères minimum. Transmettez-le à la personne de façon sûre ; elle pourra le changer dans Paramètres.">
          <MotDePasseInput value={password} onChange={setPassword} generer autoComplete="new-password" />
        </Field>
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modal>
  );
}

function ReinitialiserMotDePasse({ utilisateur, onClose }: { utilisateur: Utilisateur | null; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    setPassword("");
    setErreur("");
  }, [utilisateur]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!utilisateur) return;
    setPending(true);
    const { ok, data } = await appel(`/api/utilisateurs/${utilisateur.id}`, { method: "PATCH", body: JSON.stringify({ password }) });
    setPending(false);
    if (ok) {
      toast.success(`Mot de passe de ${utilisateur.email} réinitialisé`);
      onClose();
    } else {
      setErreur(data?.error ?? "Erreur lors de la réinitialisation");
    }
  };

  return (
    <Modal
      open={!!utilisateur}
      onClose={onClose}
      title="Réinitialiser le mot de passe"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="reinit-mdp" disabled={pending} icon={pending ? <Loader2 className="size-4 animate-spin" /> : undefined}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="reinit-mdp" onSubmit={submit} className="space-y-4">
        <p className="text-sm text-slate-600">
          Nouveau mot de passe pour <strong className="text-slate-900">{utilisateur?.email}</strong>.
        </p>
        <Field label="Nouveau mot de passe" required hint="8 caractères minimum.">
          <MotDePasseInput value={password} onChange={setPassword} generer autoComplete="new-password" autoFocus />
        </Field>
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modal>
  );
}

function MonMotDePasse() {
  const [actuel, setActuel] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [erreur, setErreur] = useState("");

  const differents = confirmation.length > 0 && confirmation !== nouveau;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (nouveau !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas");
      return;
    }
    setPending(true);
    setErreur("");
    const { ok, data } = await appel("/api/auth/password", { method: "PATCH", body: JSON.stringify({ actuel, nouveau }) });
    setPending(false);
    if (ok) {
      toast.success("Mot de passe modifié");
      setActuel("");
      setNouveau("");
      setConfirmation("");
    } else {
      setErreur(data?.error ?? "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <Panel title="Mon mot de passe" description="Changez le mot de passe de votre compte.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Mot de passe actuel" required>
          <MotDePasseInput value={actuel} onChange={setActuel} autoComplete="current-password" />
        </Field>
        <Field label="Nouveau mot de passe" required hint="8 caractères minimum.">
          <MotDePasseInput value={nouveau} onChange={setNouveau} autoComplete="new-password" />
        </Field>
        <Field label="Confirmation" required>
          <Input
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            autoComplete="new-password"
            required
            className={cn(differents && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
          />
        </Field>
        {differents && <p className="-mt-2 text-xs text-red-600">Les deux mots de passe ne correspondent pas.</p>}
        {erreur && <Erreur>{erreur}</Erreur>}
        <Button type="submit" className="w-full" disabled={pending} icon={pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}>
          Changer le mot de passe
        </Button>
      </form>
    </Panel>
  );
}

function Erreur({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}
