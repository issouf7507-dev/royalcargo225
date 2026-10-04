"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdresseModal from "./AdresseModal";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/#tarifs", label: "Tarifs" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "À propos" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [adresseOpen, setAdresseOpen] = useState(false);

  return (
    <nav className="w-full bg-zinc-950/60 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="w-30 h-14 object-contain"
            src="/logo.png"
            width={150}
            height={56}
            alt="Royal Cargo logo"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-zinc-400 font-medium hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="px-5 py-2 rounded-full bg-white text-zinc-950 text-sm font-semibold transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
            onClick={() => setAdresseOpen(true)}
          >
            Demande d'adresse
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-zinc-300 font-medium hover:text-white hover:bg-white/5 rounded-full transition-all"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              className="mt-3 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all w-full"
              onClick={() => {
                setAdresseOpen(true);
                setOpen(false);
              }}
            >
              Demande d'adresse
            </button>
          </div>
        </div>
      )}

      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />
    </nav>
  );
}
