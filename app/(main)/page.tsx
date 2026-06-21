"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import {
  Plane,
  Ship,
  Package,
  MapPin,
  FileCheck,
  Truck,
  HeadsetIcon,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  Search,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import AdresseModal from "@/components/AdresseModal";
import FindRequestModal from "@/components/FindRequestModal";
import Link from "next/link";

const serviceCoteDivoire = [
  {
    id: 1,
    icons: <Plane className="w-9 h-9 text-primary" />,
    title: "Envoi Express",
    desc: "Vos colis arrivent à destination en un clin d'œil.",
    price: "12 000 FR/KG",
    delay: "5 jours",
    badge: "Le plus rapide",
    badgeColor: "bg-orange-500",
  },
  {
    id: 2,
    icons: <Plane className="w-9 h-9 text-primary" />,
    title: "Envoi Normal",
    desc: "Profitez de tarifs avantageux pour vos envois réguliers.",
    price: "9 500 FR/KG",
    delay: "2 semaines",
    badge: "Économique",
    badgeColor: "bg-blue-500",
  },
  {
    id: 3,
    icons: <Ship className="w-9 h-9 text-primary" />,
    title: "Envoi Maritime",
    desc: "Vos colis traversent les océans en toute sérénité.",
    price: "CBM (M³)",
    delay: "Sur devis",
    badge: "Grandes quantités",
    badgeColor: "bg-green-600",
  },
];

const serviceMali = [
  {
    id: 1,
    icons: <Plane className="w-9 h-9 text-primary" />,
    title: "Envoi Express",
    desc: "Vos colis arrivent à destination en un clin d'œil.",
    price: "12 000 FR/KG",
    delay: "5 jours",
    badge: "Le plus rapide",
    badgeColor: "bg-orange-500",
  },
  {
    id: 2,
    icons: <Plane className="w-9 h-9 text-primary" />,
    title: "Envoi Normal",
    desc: "Profitez de tarifs avantageux pour vos envois réguliers.",
    price: "9 500 FR/KG",
    delay: "2 semaines",
    badge: "Économique",
    badgeColor: "bg-blue-500",
  },
];

const steps = [
  {
    number: "1",
    title: "Demandez votre adresse",
    desc: "Remplissez le formulaire en ligne pour obtenir votre adresse de livraison en Chine.",
    icon: <MapPin className="w-7 h-7 text-primary" />,
  },
  {
    number: "2",
    title: "Expédiez en Chine",
    desc: "Envoyez vos achats à notre entrepôt en Chine avec votre code client.",
    icon: <Package className="w-7 h-7 text-primary" />,
  },
  {
    number: "3",
    title: "Nous gérons le transport",
    desc: "Royal Cargo prend en charge le transport sécurisé jusqu'en Afrique de l'Ouest.",
    icon: <Ship className="w-7 h-7 text-primary" />,
  },
  {
    number: "4",
    title: "Récupérez votre colis",
    desc: "Votre colis arrive à Abidjan ou Bamako. Nous vous contactons pour la livraison.",
    icon: <CheckCircle className="w-7 h-7 text-primary" />,
  },
];

export default function Home() {
  const [adresseOpen, setAdresseOpen] = useState(false);
  const [country, setCountry] = useState("civ");
  const [codeT, setCodeT] = useState<string>("");
  const [successData, setSuccessData] = useState<any | null>(null);

  const services = country === "civ" ? serviceCoteDivoire : serviceMali;

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/findrequestservices", {
        method: "POST",
        body: JSON.stringify({ codeTracking: codeT }),
      });
      const data = await response.json();
      if (data.status === 200) {
        setSuccessData({
          nom: data.request.nom,
          tel: data.request.tel,
          pays: data.request.pays,
          service: data.request.service,
          status: data.request.status,
          codeTracking: data.request.codeTracking,
          date: data.request.date,
          images: data.request.images,
          error: null,
        });
        setCodeT("");
      } else {
        setSuccessData({ error: "Code de tracking introuvable" });
      }
    } catch {
      setSuccessData({ error: "Code de tracking introuvable" });
    }
  };

  return (
    <>
      {successData && (
        <FindRequestModal
          openSuccess={!!successData}
          onCloseSuccess={() => setSuccessData(null)}
          data={successData}
        />
      )}

      <Hero />

      {/* ── Comment ça marche ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-950 py-20 px-6 lg:px-0"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Simple comme bonjour
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-extrabold text-white mb-4"
            >
              Comment ça marche ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 max-w-xl mx-auto"
            >
              En 4 étapes simples, recevez vos colis de Chine en Côte d'Ivoire ou au Mali.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-9 left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="relative w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-5">
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                  {step.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-center mt-14"
          >
            <button
              onClick={() => setAdresseOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-primary/25"
            >
              Commencer maintenant <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Tarifs ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-900 py-20 px-6 lg:px-0"
        id="tarifs"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Transparence totale
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Nos Tarifs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 mb-10 max-w-lg mx-auto"
          >
            Choisissez votre destination pour voir les tarifs disponibles.
          </motion.p>

          {/* Country toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-1.5 mb-10 p-1.5 bg-gray-800 rounded-full border border-gray-700"
          >
            <button
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                country === "civ"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setCountry("civ")}
            >
              🇨🇮 Côte d'Ivoire
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                country === "mali"
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setCountry("mali")}
            >
              🇲🇱 Mali
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {services.map((svc, index) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                className="relative group border border-gray-700 hover:border-primary/50 rounded-2xl p-6 text-left transition-all bg-gray-800 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Badge */}
                <span className={`absolute top-4 right-4 text-xs text-white px-2.5 py-1 rounded-full font-semibold ${svc.badgeColor}`}>
                  {svc.badge}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  {svc.icons}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{svc.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{svc.desc}</p>

                <div className="flex items-center justify-between mb-5">
                  <span className="text-primary font-bold text-xl">{svc.price}</span>
                  <span className="text-xs text-gray-500 bg-gray-700 px-2.5 py-1 rounded-full">{svc.delay}</span>
                </div>

                <button
                  onClick={() => setAdresseOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  Choisir ce service
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Services ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-950 py-20 px-6 lg:px-0"
        id="services"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Ce que nous offrons
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            Nos Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 mb-14 max-w-2xl mx-auto"
          >
            Une solution logistique complète pour garantir l'acheminement sécurisé et rapide
            de vos colis de la Chine vers l'Afrique de l'Ouest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: <Ship className="w-6 h-6 text-white" />,
                bg: "bg-blue-600",
                title: "Transport maritime sécurisé",
                desc: "Expédition de vos colis en conteneur ou groupage, avec suivi et assurance incluse.",
              },
              {
                icon: <Package className="w-6 h-6 text-white" />,
                bg: "bg-orange-500",
                title: "Réception & stockage en Chine",
                desc: "Une adresse dédiée pour centraliser vos achats, contrôler la qualité et organiser les envois.",
              },
              {
                icon: <MapPin className="w-6 h-6 text-white" />,
                bg: "bg-green-600",
                title: "Suivi en temps réel",
                desc: "Accédez à l'état de vos colis en temps réel grâce à notre plateforme en ligne sécurisée.",
              },
              {
                icon: <FileCheck className="w-6 h-6 text-white" />,
                bg: "bg-purple-600",
                title: "Dédouanement simplifié",
                desc: "Nous nous chargeons des formalités douanières à Abidjan ou Bamako pour une livraison fluide.",
              },
              {
                icon: <Truck className="w-6 h-6 text-white" />,
                bg: "bg-red-500",
                title: "Livraison à domicile",
                desc: "Livraison à votre adresse en Côte d'Ivoire ou au Mali avec des partenaires de confiance.",
              },
              {
                icon: <HeadsetIcon className="w-6 h-6 text-white" />,
                bg: "bg-teal-600",
                title: "Support client dédié",
                desc: "Une équipe locale disponible 7j/7 pour répondre à vos questions et vous assister.",
              },
            ].map((svc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group bg-gray-900 border border-gray-800 hover:border-gray-600 p-6 rounded-2xl hover:shadow-xl transition-all text-left"
              >
                <div className={`w-12 h-12 ${svc.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {svc.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{svc.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Suivi ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-900 py-20 px-6 lg:px-0"
        id="suivi"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Où est mon colis ?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Suivre ma cargaison
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 mb-10"
          >
            Entrez votre numéro de suivi pour connaître l'état de votre cargaison en temps réel.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
            onSubmit={handleRequest}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Numéro de suivi (ex: RC-123456)"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-white bg-gray-800 transition-all"
                value={codeT}
                onChange={(e) => setCodeT(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Suivre
            </button>
          </motion.form>
        </div>
      </motion.section>

      {/* ── À propos ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-950 py-20 px-6 lg:px-0"
        id="about"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary font-semibold text-sm uppercase tracking-widest"
            >
              Notre mission
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Relier les continents, simplifier la logistique
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 leading-relaxed"
            >
              Fondée avec la volonté de rapprocher l'Afrique de ses partenaires commerciaux,
              Royal Cargo s'engage à offrir des services de transport sûrs, rapides et accessibles.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-500 leading-relaxed"
            >
              Notre vision : devenir le pont incontournable entre la Chine, la Côte d'Ivoire et le Mali.
              Logistique transparente, suivi en temps réel, tarifs clairs et accompagnement humain.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-3"
            >
              {["Fiabilité & sécurité", "Transparence & confiance", "Engagement local & international"].map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                )
              )}
            </motion.ul>
          </div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "500+", label: "Colis traités", icon: <Package className="w-6 h-6 text-primary" /> },
              { value: "2", label: "Pays desservis", icon: <MapPin className="w-6 h-6 text-primary" /> },
              { value: "7j/7", label: "Support client", icon: <HeadsetIcon className="w-6 h-6 text-primary" /> },
              { value: "100%", label: "Suivi garanti", icon: <Shield className="w-6 h-6 text-primary" /> },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Contact ── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-900 py-20 px-6 lg:px-0"
        id="contact"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary font-semibold text-sm uppercase tracking-widest"
            >
              Nous joindre
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Contactez-nous
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400"
            >
              Vous avez une question ? Besoin d'un devis ou d'un accompagnement ?
              Notre équipe est disponible pour vous répondre rapidement.
            </motion.p>

            {/* WhatsApp CTA */}
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              href="https://wa.me/2250564919216"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-green-600/10 border border-green-600/30 rounded-2xl hover:bg-green-600/20 transition-all group"
            >
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold">Discutez sur WhatsApp</div>
                <div className="text-green-400 text-sm group-hover:underline">+225 05 64 91 92 16</div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 ml-auto" />
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-5 text-sm text-gray-400"
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold mb-1">Adresse</div>
                  Boulevard du Cameroun, Ligne 11
                  <br />
                  Grand marché de Marcory, Abidjan, Côte d'Ivoire
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold mb-1">Téléphones</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href="tel:+2250564919216" className="hover:text-primary transition-colors">
                        +225 05 64 91 92 16 (Côte d'Ivoire)
                      </Link>
                    </li>
                    <li>
                      <Link href="tel:+2250700009595" className="hover:text-primary transition-colors">
                        +225 07 00 00 95 95 (Côte d'Ivoire)
                      </Link>
                    </li>
                    <li>
                      <Link href="tel:+22377181175" className="hover:text-primary transition-colors">
                        +223 77 18 11 75 (Mali)
                      </Link>
                    </li>
                    <li className="text-gray-500">+86 186 2097 5453 (Chine)</li>
                    <li className="text-gray-500">+86 188 0207 2454 (Chine)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-semibold mb-1">Email</div>
                  royalcargo225@gmail.com
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5 bg-gray-800 p-8 rounded-2xl border border-gray-700"
          >
            <h3 className="text-white font-bold text-xl mb-2">Envoyer un message</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Nom complet</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-900 text-white outline-none transition-all"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-900 text-white outline-none transition-all"
                placeholder="Votre adresse email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-900 text-white outline-none transition-all resize-none"
                placeholder="Votre message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
            >
              Envoyer le message
            </button>
          </motion.form>
        </div>
      </motion.section>

      {/* ── Bouton WhatsApp flottant ── */}
      <a
        href="https://wa.me/2250564919216"
        target="_blank"
        rel="noopener noreferrer"
        title="Contactez-nous sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all hover:scale-110"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />
    </>
  );
}
