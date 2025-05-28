"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdresseModal from "./AdresseModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [adresseOpen, setAdresseOpen] = useState(false);
  return (
    <nav className="w-full bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-2xl text-primary"
        >
          <span className="inline-block w-8 h-8 bg-primary rounded-full mr-2"></span>
          RoyalCargo
        </Link>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-400 font-medium hover:text-primary transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/#tarifs"
            className="text-gray-400 font-medium hover:text-primary transition-colors"
          >
            Tarifs
          </Link>
          <Link
            href="/#about"
            className="text-gray-400 font-medium hover:text-primary transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/#contact"
            className="text-gray-400 font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <button
            className="ml-4 px-5 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-orange-600 transition-colors"
            onClick={() => setAdresseOpen(true)}
          >
            Demande d'adresse
          </button>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-900 shadow-lg border-t border-gray-100 animate-fade-in">
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link
              href="/"
              className="text-gray-400 font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/#tarifs"
              className="text-gray-400 font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/#about"
              className="text-gray-400 font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/#contact"
              className="text-gray-400 font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <button
              className="mt-2 px-5 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-orange-600 transition-colors w-full"
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
