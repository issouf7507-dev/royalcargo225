"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const navigation = useRouter();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-400">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-0 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="text-white text-xl font-extrabold mb-3">Royal Cargo 225</h2>
          <p className="text-sm leading-relaxed mb-4">
            Transport fiable entre la Chine, la Côte d'Ivoire et le Mali.
            Sécurité, rapidité et suivi en temps réel.
          </p>
          <a
            href="https://wa.me/2250564919216"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/15 border border-green-600/30 text-green-400 text-sm rounded-full hover:bg-green-600/25 transition-all font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp direct
          </a>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/#services", label: "Services" },
              { href: "/#suivi", label: "Suivi colis" },
              { href: "/#tarifs", label: "Tarifs" },
              { href: "/#about", label: "À propos" },
              { href: "/#contact", label: "Contact" },
              { href: "/terms", label: "Conditions d'utilisation" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <Link href="tel:+2250564919216" className="hover:text-white transition-colors">
                +225 05 64 91 92 16
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <Link href="tel:+2250700009595" className="hover:text-white transition-colors">
                +225 07 00 00 95 95
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <Link href="tel:+22377181175" className="hover:text-white transition-colors">
                +223 77 18 11 75 (Mali)
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span>royalcargo225@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Chine contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Bureau Chine</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-base">🇨🇳</span>
              <span>+86 186 2097 5453</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-base">🇨🇳</span>
              <span>+86 188 0207 2454</span>
            </li>
            <li className="text-xs text-gray-500 mt-3 leading-relaxed">
              Guangzhou, Province du Guangdong<br />
              Chine (中国)
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 lg:px-0 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} Royal Cargo 225. Tous droits réservés.</span>
          <Link href="/terms" className="hover:text-gray-400 transition-colors">
            Conditions d'utilisation
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
