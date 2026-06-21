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
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            className="w-30 h-14 object-contain"
            src="/logo.png"
            objectFit="contain"
            width={150}
            height={56}
            alt="Royal Cargo logo"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-gray-400 font-medium hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow hover:bg-orange-600 transition-all shadow-primary/20"
            onClick={() => setAdresseOpen(true)}
          >
            Demande d'adresse
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-gray-300 font-medium hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              className="mt-3 px-5 py-2.5 rounded-full bg-primary text-white font-semibold shadow hover:bg-orange-600 transition-all w-full"
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
