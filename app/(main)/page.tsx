"use client";
import React, { useState } from "react";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
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
    icon: Plane,
    title: "Envoi Express",
    desc: "Vos colis arrivent à destination en un clin d'œil.",
    price: "12 000 FR/KG",
    delay: "5 jours",
    badge: "Le plus rapide",
  },
  {
    id: 2,
    icon: Plane,
    title: "Envoi Normal",
    desc: "Profitez de tarifs avantageux pour vos envois réguliers.",
    price: "9 500 FR/KG",
    delay: "2 semaines",
    badge: "Économique",
  },
  {
    id: 3,
    icon: Ship,
    title: "Envoi Maritime",
    desc: "Vos colis traversent les océans en toute sérénité.",
    price: "CBM (M³)",
    delay: "Sur devis",
    badge: "Grandes quantités",
  },
];

const serviceMali = serviceCoteDivoire.slice(0, 2);

const steps = [
  {
    number: "01",
    title: "Demandez votre adresse",
    desc: "Remplissez le formulaire en ligne pour obtenir votre adresse de livraison en Chine.",
    icon: MapPin,
  },
  {
    number: "02",
    title: "Expédiez en Chine",
    desc: "Envoyez vos achats à notre entrepôt en Chine avec votre code client.",
    icon: Package,
  },
  {
    number: "03",
    title: "Nous gérons le transport",
    desc: "Royal Cargo prend en charge le transport sécurisé jusqu'en Afrique de l'Ouest.",
    icon: Ship,
  },
  {
    number: "04",
    title: "Récupérez votre colis",
    desc: "Votre colis arrive à Abidjan ou Bamako. Nous vous contactons pour la livraison.",
    icon: CheckCircle,
  },
];

const features = [
  {
    icon: Ship,
    title: "Transport maritime sécurisé",
    desc: "Expédition de vos colis en conteneur ou groupage, avec suivi et assurance incluse.",
  },
  {
    icon: Package,
    title: "Réception & stockage en Chine",
    desc: "Une adresse dédiée pour centraliser vos achats, contrôler la qualité et organiser les envois.",
  },
  {
    icon: MapPin,
    title: "Suivi en temps réel",
    desc: "Accédez à l'état de vos colis en temps réel grâce à notre plateforme en ligne sécurisée.",
  },
  {
    icon: FileCheck,
    title: "Dédouanement simplifié",
    desc: "Nous nous chargeons des formalités douanières à Abidjan ou Bamako pour une livraison fluide.",
  },
  {
    icon: Truck,
    title: "Livraison à domicile",
    desc: "Livraison à votre adresse en Côte d'Ivoire ou au Mali avec des partenaires de confiance.",
  },
  {
    icon: HeadsetIcon,
    title: "Support client dédié",
    desc: "Une équipe locale disponible 7j/7 pour répondre à vos questions et vous assister.",
  },
];

const aboutStats = [
  { value: "500+", label: "Colis traités", icon: Package },
  { value: "2", label: "Pays desservis", icon: MapPin },
  { value: "7j/7", label: "Support client", icon: HeadsetIcon },
  { value: "100%", label: "Suivi garanti", icon: Shield },
];

// --- Styles partagés ---
const glassCard =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl";
const iconTile =
  "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20";
const primaryBtn =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]";
const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-white/30 focus:bg-white/10";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300">
      {children}
    </span>
  </div>
);

const SectionHeader = ({
  eyebrow,
  title,
  accent,
  desc,
  center = true,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  desc?: string;
  center?: boolean;
}) => (
  <Reveal className={`space-y-5 ${center ? "text-center mx-auto max-w-2xl" : ""}`}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter leading-[1.05] text-white">
      {title}{" "}
      {accent && (
        <span className="bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
          {accent}
        </span>
      )}
    </h2>
    {desc && <p className="text-lg text-zinc-400 leading-relaxed">{desc}</p>}
  </Reveal>
);

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
    <div className="bg-zinc-950 text-white">
      {successData && (
        <FindRequestModal
          openSuccess={!!successData}
          onCloseSuccess={() => setSuccessData(null)}
          data={successData}
        />
      )}

      <Hero />

      {/* ── Comment ça marche ── */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Simple comme bonjour"
            title="Comment ça"
            accent="marche ?"
            desc="En 4 étapes simples, recevez vos colis de Chine en Côte d'Ivoire ou au Mali."
          />

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={0.1 * i} className={`${glassCard} p-7`}>
                <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="relative flex items-center justify-between mb-8">
                  <div className={iconTile}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-medium tracking-tighter text-white/15">{step.number}</span>
                </div>
                <h3 className="relative text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="relative text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4} className="mt-12 text-center">
            <button onClick={() => setAdresseOpen(true)} className={primaryBtn}>
              Commencer maintenant
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── Tarifs ── */}
      <section id="tarifs" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Transparence totale"
            title="Nos"
            accent="tarifs"
            desc="Choisissez votre destination pour voir les tarifs disponibles."
          />

          {/* Country toggle */}
          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
              {[
                { key: "civ", label: "🇨🇮 Côte d'Ivoire" },
                { key: "mali", label: "🇲🇱 Mali" },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCountry(c.key)}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                    country === c.key ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((svc, i) => (
              <Reveal
                key={`${country}-${svc.id}`}
                delay={0.1 * i}
                className={`${glassCard} group flex flex-col p-8 shadow-2xl transition-colors hover:border-white/20`}
              >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-56 w-56 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="relative flex items-start justify-between mb-8">
                  <div className={iconTile}>
                    <svc.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-300">
                    {svc.badge}
                  </span>
                </div>

                <h3 className="relative text-xl font-semibold text-white mb-2">{svc.title}</h3>
                <p className="relative text-sm text-zinc-400 mb-8">{svc.desc}</p>

                <div className="relative h-px w-full bg-white/10 mb-6" />

                <div className="relative flex items-end justify-between mb-8">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Tarif</div>
                    <div className="text-2xl font-bold tracking-tight text-white">{svc.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Délai</div>
                    <div className="text-sm font-medium text-white">{svc.delay}</div>
                  </div>
                </div>

                <button
                  onClick={() => setAdresseOpen(true)}
                  className="relative mt-auto w-full rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-zinc-950"
                >
                  Choisir ce service
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Ce que nous offrons"
            title="Nos"
            accent="services"
            desc="Une solution logistique complète pour garantir l'acheminement sécurisé et rapide de vos colis de la Chine vers l'Afrique de l'Ouest."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={0.08 * i}
                className={`${glassCard} group p-7 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]`}
              >
                <div className={`${iconTile} mb-6 transition-transform group-hover:scale-110`}>
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Suivi ── */}
      <section id="suivi" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <Reveal className={`${glassCard} mx-auto max-w-5xl px-6 py-16 text-center shadow-2xl sm:px-12`}>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative space-y-5">
            <Eyebrow>
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Où est mon colis ?
              </span>
            </Eyebrow>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              Suivre ma{" "}
              <span className="bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
                cargaison
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Entrez votre numéro de suivi pour connaître l&apos;état de votre cargaison en temps réel.
            </p>
            <form
              onSubmit={handleRequest}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-3xl border border-white/10 bg-zinc-950/50 p-2 sm:flex-row sm:rounded-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Numéro de suivi (ex: RC-123456)"
                  value={codeT}
                  onChange={(e) => setCodeT(e.target.value)}
                  className="w-full rounded-full bg-transparent py-3 pl-12 pr-4 text-white placeholder-zinc-500 outline-none"
                />
              </div>
              <button type="submit" className={`${primaryBtn} whitespace-nowrap`}>
                Suivre
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* ── À propos ── */}
      <section id="about" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeader
              center={false}
              eyebrow="Notre mission"
              title="Relier les continents,"
              accent="simplifier la logistique"
            />
            <Reveal delay={0.1} className="max-w-xl space-y-4 text-lg leading-relaxed">
              <p className="text-zinc-400">
                Fondée avec la volonté de rapprocher l&apos;Afrique de ses partenaires commerciaux,
                Royal Cargo s&apos;engage à offrir des services de transport sûrs, rapides et accessibles.
              </p>
              <p className="text-zinc-500 text-base">
                Notre vision : devenir le pont incontournable entre la Chine, la Côte d&apos;Ivoire et le Mali.
                Logistique transparente, suivi en temps réel, tarifs clairs et accompagnement humain.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="flex flex-wrap gap-2">
              {["Fiabilité & sécurité", "Transparence & confiance", "Engagement local & international"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                )
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {aboutStats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 * i} className={`${glassCard} p-6`}>
                <div className={`${iconTile} mb-6`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-3xl font-bold tracking-tight text-white">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">
                  {stat.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 space-y-8">
            <SectionHeader
              center={false}
              eyebrow="Nous joindre"
              title="Contactez-nous"
              desc="Vous avez une question ? Besoin d'un devis ou d'un accompagnement ? Notre équipe est disponible pour vous répondre rapidement."
            />

            {/* WhatsApp CTA */}
            <Reveal delay={0.1}>
              <a
                href="https://wa.me/2250564919216"
                target="_blank"
                rel="noopener noreferrer"
                className={`${glassCard} group flex items-center gap-4 p-4 transition-colors hover:border-green-500/40 hover:bg-green-500/10`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-600">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">Discutez sur WhatsApp</div>
                  <div className="text-sm text-green-400">+225 05 64 91 92 16</div>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-green-500 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>

            <Reveal delay={0.2} className="space-y-6 text-sm text-zinc-400">
              <div className="flex items-start gap-4">
                <div className={`${iconTile} h-10 w-10 flex-shrink-0`}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-white">Adresse</div>
                  Boulevard du Cameroun, Ligne 11
                  <br />
                  Grand marché de Marcory, Abidjan, Côte d&apos;Ivoire
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`${iconTile} h-10 w-10 flex-shrink-0`}>
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-white">Téléphones</div>
                  <ul className="space-y-1">
                    <li>
                      <Link href="tel:+2250564919216" className="transition-colors hover:text-white">
                        +225 05 64 91 92 16 (Côte d&apos;Ivoire)
                      </Link>
                    </li>
                    <li>
                      <Link href="tel:+2250700009595" className="transition-colors hover:text-white">
                        +225 07 00 00 95 95 (Côte d&apos;Ivoire)
                      </Link>
                    </li>
                    <li>
                      <Link href="tel:+22377181175" className="transition-colors hover:text-white">
                        +223 77 18 11 75 (Mali)
                      </Link>
                    </li>
                    <li className="text-zinc-500">+86 186 2097 5453 (Chine)</li>
                    <li className="text-zinc-500">+86 188 0207 2454 (Chine)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className={`${iconTile} h-10 w-10 flex-shrink-0`}>
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="mb-1 font-semibold text-white">Email</div>
                  royalcargo225@gmail.com
                </div>
              </div>
            </Reveal>
          </div>

          {/* Contact form */}
          <Reveal delay={0.2} className="lg:col-span-6">
            <form className={`${glassCard} space-y-5 p-8 shadow-2xl`}>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <h3 className="relative mb-2 text-xl font-semibold text-white">Envoyer un message</h3>
              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Nom complet</label>
                <input type="text" className={inputClass} placeholder="Votre nom" />
              </div>
              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Email</label>
                <input type="email" className={inputClass} placeholder="Votre adresse email" />
              </div>
              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Message</label>
                <textarea rows={5} className={`${inputClass} resize-none`} placeholder="Votre message..." />
              </div>
              <button type="submit" className={`${primaryBtn} relative w-full py-3.5`}>
                Envoyer le message
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ── Bouton WhatsApp flottant ── */}
      <a
        href="https://wa.me/2250564919216"
        target="_blank"
        rel="noopener noreferrer"
        title="Contactez-nous sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-xl shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>

      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />
    </div>
  );
}
