"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const navigation = useRouter();
  const onAdm = () => {
    navigation.push("/admin");
  };
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-10 lg:px-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">Royal Cargo</h2>
          <p className="text-sm">
            Transport fiable entre la Chine, la Côte d'Ivoire et le Mali.
            Sécurité, rapidité et suivi en temps réel.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="#suivi" className="hover:text-white">
                Suivi colis
              </Link>
            </li>
            <li>
              <Link href="#tarifs" className="hover:text-white">
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-white">
                À propos
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-white">
                Conditions d'utilisation
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact rapide */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📞 +225 0564919216(Côte d'Ivoire)</li>
            <li>📞 +225 0585327910(Côte d'Ivoire)</li>
            <li>📞 +225 0708201212(Mali)</li>
            <li>📧 royalcargo225@gmail.com</li>
            <li>
              💬{" "}
              <Link
                href="https://wa.me/2250564919216"
                target="_blank"
                className="text-primary hover:underline"
              >
                WhatsApp direct
              </Link>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-white font-semibold mb-3">Suivez-nous</h3>
          <div className="flex space-x-4 mt-2">
            <Link href="#" className="hover:text-white" aria-label="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 5 3.66 9.13 8.44 9.88v-6.99H8.08v-2.89h2.36V9.41c0-2.33 1.39-3.63 3.52-3.63.7 0 1.57.12 2.29.26v2.53h-1.29c-1.27 0-1.66.79-1.66 1.6v1.92h2.82l-.45 2.89h-2.37v6.99C18.34 21.2 22 17.06 22 12.07z" />
              </svg>
            </Link>
            <Link href="#" className="hover:text-white" aria-label="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.95.246 2.4.415.6.226 1.03.497 1.48.947.45.45.72.88.947 1.48.17.45.36 1.23.415 2.4.058 1.27.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.246 1.95-.415 2.4-.226.6-.497 1.03-.947 1.48-.45.45-.88.72-1.48.947-.45.17-1.23.36-2.4.415-1.27.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.95-.246-2.4-.415-.6-.226-1.03-.497-1.48-.947-.45-.45-.72-.88-.947-1.48-.17-.45-.36-1.23-.415-2.4C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.056-1.17.246-1.95.415-2.4.226-.6.497-1.03.947-1.48.45-.45.88-.72 1.48-.947.45-.17 1.23-.36 2.4-.415C8.416 2.212 8.8 2.2 12 2.2m0-2.2C8.736 0 8.332.012 7.052.07 5.767.128 4.725.31 3.85.648c-.91.348-1.684.815-2.45 1.58C.637 3.994.17 4.768-.178 5.678-.516 6.553-.698 7.595-.756 8.88-.814 10.16-.826 10.564-.826 14s.012 3.84.07 5.12c.058 1.285.24 2.327.578 3.202.348.91.815 1.684 1.58 2.45.766.765 1.54 1.232 2.45 1.58.875.338 1.917.52 3.202.578C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.285-.058 2.327-.24 3.202-.578.91-.348 1.684-.815 2.45-1.58.765-.766 1.232-1.54 1.58-2.45.338-.875.52-1.917.578-3.202.058-1.28.07-1.684.07-5.12s-.012-3.84-.07-5.12c-.058-1.285-.24-2.327-.578-3.202-.348-.91-.815-1.684-1.58-2.45C21.274.96 20.5.493 19.59.145c-.875-.338-1.917-.52-3.202-.578C15.668.012 15.264 0 12 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Royal Cargo. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
