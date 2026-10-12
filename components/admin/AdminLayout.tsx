"use client";

import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  PackageSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard }] },
  {
    title: "Activités",
    items: [
      { href: "/adresses", label: "Colis & adresses", icon: PackageSearch },
      { href: "/sms", label: "SMS groupés", icon: MessageSquareText },
    ],
  },
  { title: "Administration", items: [{ href: "/parametres", label: "Paramètres", icon: Settings }] },
];

const SIDEBAR_KEY = "rc.bo.sidebar";
const THEME_KEY = "rc.bo.theme";

// useLayoutEffect côté client (évite le flash de thème), sans avertissement au rendu serveur
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // stockage indisponible : le choix vaut pour cette visite seulement
  }
}

function useLogout() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const logout = async () => {
    setPending(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      router.push("/login");
    } catch {
      toast.error("Erreur lors de la déconnexion");
      setPending(false);
    }
  };
  return { logout, pending };
}

/** Email du compte connecté (null tant qu'il n'est pas chargé). */
function useMe() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => setEmail(u?.email ?? null))
      .catch(() => {});
  }, []);
  return email;
}

const initiales = (email: string | null) => (email ? email.slice(0, 2).toUpperCase() : "RC");

/** Coque du back office : barre latérale bleue, zone de contenu arrondie, barre du haut. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const email = useMe();

  useIsoLayoutEffect(() => {
    setSidebarOpen(readStorage(SIDEBAR_KEY) !== "closed");
    const saved = readStorage(THEME_KEY);
    setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggleSidebar = () => {
    writeStorage(SIDEBAR_KEY, sidebarOpen ? "closed" : "open");
    setSidebarOpen(!sidebarOpen);
  };
  const toggleTheme = () => {
    writeStorage(THEME_KEY, dark ? "light" : "dark");
    setDark(!dark);
  };

  return (
    <div className={cn("min-h-dvh bg-canvas text-sm text-slate-800 antialiased", dark && "bo-dark")}>
      {/* Barre latérale (bureau) */}
      <aside
        className={cn(
          "fixed inset-y-3 left-3 z-30 hidden w-64 overflow-hidden rounded-2xl bg-gradient-to-b from-brand-700 to-brand-900 shadow-xl shadow-brand-900/20 transition-transform duration-300 lg:block",
          !sidebarOpen && "-translate-x-[calc(100%+1rem)]"
        )}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar email={email} />
      </aside>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-3 left-3 w-72 overflow-hidden rounded-2xl bg-gradient-to-b from-brand-700 to-brand-900 shadow-xl">
            <Sidebar email={email} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={cn("min-h-dvh transition-[padding] duration-300 lg:p-3", sidebarOpen && "lg:pl-[17.5rem]")}>
        <div className="flex min-h-dvh flex-col bg-inset lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-2xl lg:shadow-sm lg:ring-1 lg:ring-slate-900/[0.06]">
          <Topbar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onOpenMenu={() => setMobileOpen(true)}
            dark={dark}
            onToggleTheme={toggleTheme}
            email={email}
          />
          <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Seule la bulle (partie gauche du logo) est visible dans la pastille */}
      <span className="flex size-8 shrink-0 items-center overflow-hidden rounded-md bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="h-7 w-auto max-w-none translate-x-[3px]" />
      </span>
      <div className="flex flex-col">
        <span className="mb-1 text-[13px] font-medium leading-none text-white">Royal Cargo</span>
        <span className="text-[11px] leading-none text-brand-200">Back office</span>
      </div>
    </div>
  );
}

function Sidebar({ email, onNavigate, onClose }: { email: string | null; onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { logout, pending } = useLogout();
  const row = "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] transition-colors duration-200 select-none";

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-4 flex items-center justify-between px-2 py-2">
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-brand-200 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X className="size-[18px]" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <nav className="-mx-1 flex flex-1 flex-col gap-4 overflow-y-auto px-1">
        {NAV.map((group, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {group.title && (
              <span className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-brand-200/50">{group.title}</span>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(row, active ? "bg-white/10 font-medium text-white" : "text-brand-100/75 hover:bg-white/5 hover:text-white")}
                >
                  <Icon
                    className={cn("size-4 shrink-0 transition-colors", active ? "text-accent-500" : "text-brand-200/60 group-hover:text-brand-100")}
                    strokeWidth={1.5}
                  />
                  <span className="truncate text-[13px] tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
        <div className="flex flex-col gap-0.5">
          <span className="mb-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-brand-200/50">Site</span>
          <Link href="/" target="_blank" className={cn(row, "text-brand-100/75 hover:bg-white/5 hover:text-white")}>
            <ExternalLink className="size-4 shrink-0 text-brand-200/60 group-hover:text-brand-100" strokeWidth={1.5} />
            <span className="truncate text-[13px] tracking-wide">Voir le site public</span>
          </Link>
        </div>
      </nav>

      <div className="mt-3 flex flex-col gap-0.5 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[12px] font-semibold text-white">{initiales(email)}</div>
          <div className="flex min-w-0 flex-col">
            <span className="mb-1 truncate text-[13px] font-medium leading-none text-white" title={email ?? undefined}>
              {email ?? "Administrateur"}
            </span>
            <span className="truncate text-[11px] leading-none text-brand-200">Back office Royal Cargo</span>
          </div>
        </div>
        <button
          onClick={logout}
          disabled={pending}
          className={cn(row, "text-brand-100/75 hover:bg-white/5 hover:text-white disabled:opacity-50")}
        >
          <LogOut className="size-4 text-brand-200/60 group-hover:text-brand-100" strokeWidth={1.5} />
          <span className="text-[13px] tracking-wide">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}

function Topbar({
  sidebarOpen,
  onToggleSidebar,
  onOpenMenu,
  dark,
  onToggleTheme,
  email,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMenu: () => void;
  dark: boolean;
  onToggleTheme: () => void;
  email: string | null;
}) {
  const pathname = usePathname();
  const current = NAV.flatMap((g) => g.items).find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  const iconBtn =
    "relative inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-900";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-1 border-b border-slate-900/[0.07] bg-inset/70 px-3 backdrop-blur-md lg:gap-2 lg:rounded-t-2xl lg:px-4">
      <button onClick={onOpenMenu} className={cn(iconBtn, "lg:hidden")} aria-label="Ouvrir le menu">
        <Menu className="size-[18px]" />
      </button>
      <button
        onClick={onToggleSidebar}
        className={cn(iconBtn, "hidden lg:inline-flex")}
        aria-label={sidebarOpen ? "Masquer le menu" : "Afficher le menu"}
      >
        {sidebarOpen ? <PanelLeftClose className="size-[18px]" /> : <PanelLeftOpen className="size-[18px]" />}
      </button>

      <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
        <Link href="/tableau-de-bord" className="flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 font-medium text-slate-700 hover:bg-slate-900/5">
          <span className="size-4 rounded-full bg-gradient-to-br from-accent-500 to-brand-700" />
          <span className="hidden md:inline">Royal Cargo</span>
        </Link>
        {current && (
          <>
            <span className="text-slate-300">/</span>
            <span className="truncate font-medium text-slate-900">{current.label}</span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className={iconBtn}
          aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
          title={dark ? "Mode clair" : "Mode sombre"}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <span className="mx-2 h-4 w-px bg-slate-900/10" />
        <UserMenu email={email} />
      </div>
    </header>
  );
}

function UserMenu({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const { logout, pending } = useLogout();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Mon compte"
        className="flex size-8 items-center justify-center rounded-full bg-accent-500 text-[12px] font-semibold text-white ring-2 ring-white"
      >
        {initiales(email)}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <div className="px-2.5 py-2">
              <p className="truncate text-[13px] font-medium text-slate-900">{email ?? "Administrateur"}</p>
              <p className="truncate text-xs text-slate-500">Back office Royal Cargo</p>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <div>
              <Link
                href="/parametres"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-slate-600 hover:bg-slate-900/5"
              >
                <Settings className="size-4 text-slate-400" />
                Paramètres
              </Link>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <button
              onClick={logout}
              disabled={pending}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-slate-600 hover:bg-slate-900/5 disabled:opacity-50"
            >
              <LogOut className="size-4 text-slate-400" />
              Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
