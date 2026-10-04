"use client";
import AdresseModal from "./AdresseModal";
import FindRequestModal from "./FindRequestModal";
import { useState } from "react";
import { Search, Package, MapPin, Shield, Star, ArrowRight, Plane, Ship, Truck, FileCheck, Warehouse } from "lucide-react";

const SERVICES = [
  { name: "Fret aérien express", icon: Plane },
  { name: "Fret aérien normal", icon: Plane },
  { name: "Fret maritime", icon: Ship },
  { name: "Livraison à domicile", icon: Truck },
  { name: "Dédouanement", icon: FileCheck },
  { name: "Stockage en Chine", icon: Warehouse },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{label}</span>
  </div>
);

export default function Hero() {
  const [codeT, setCodeT] = useState<string>("");
  const [successData, setSuccessData] = useState<any | null>(null);
  const [adresseOpen, setAdresseOpen] = useState(false);

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
      setSuccessData({ error: "Une erreur est survenue lors de la recherche" });
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
      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />

      <section className="relative w-full min-h-screen bg-zinc-950 text-white overflow-hidden">
        {/* Background image with gradient mask */}
        <div
          className="absolute inset-0 z-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-30"
          style={{
            maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          }}
        />
        <div className="absolute -top-40 -left-40 z-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 md:pt-36 md:pb-24 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
            {/* --- LEFT COLUMN --- */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-4">
              {/* Badge */}
              <div style={{ animationDelay: "0.1s" }} className="hero-fade-in">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                  <span className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Chine → Côte d&apos;Ivoire &amp; Mali
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  </span>
                </div>
              </div>

              {/* Heading */}
              <h1
                className="hero-fade-in text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter leading-[0.95]"
                style={{
                  animationDelay: "0.2s",
                  maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                }}
              >
                Livrez vos colis
                <br />
                <span className="bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
                  simplement
                </span>
                <br />
                &amp; sûrement
              </h1>

              {/* Description */}
              <p style={{ animationDelay: "0.3s" }} className="hero-fade-in max-w-xl text-lg text-zinc-400 leading-relaxed">
                Transport de cargaison depuis la Chine vers l&apos;Afrique de l&apos;Ouest.
                Suivi en temps réel, rapidité et fiabilité pour tous vos besoins logistiques.
              </p>

              {/* Tracking form + CTA */}
              <div style={{ animationDelay: "0.4s" }} className="hero-fade-in w-full max-w-xl space-y-4">
                <form
                  onSubmit={handleRequest}
                  className="flex flex-col sm:flex-row gap-2 rounded-3xl sm:rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Numéro de suivi (ex: RC-123456)"
                      value={codeT}
                      onChange={(e) => setCodeT(e.target.value)}
                      className="w-full bg-transparent pl-12 pr-4 py-3 rounded-full text-white placeholder-zinc-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98] whitespace-nowrap"
                  >
                    Suivre
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>

                <button
                  onClick={() => setAdresseOpen(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  Demande d&apos;adresse
                </button>
              </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="lg:col-span-5 space-y-6 lg:mt-8">
              {/* Stats card */}
              <div
                style={{ animationDelay: "0.5s" }}
                className="hero-fade-in relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold tracking-tight text-white">500+</div>
                      <div className="text-sm text-zinc-400">Colis traités</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Colis livrés à temps</span>
                      <span className="text-white font-medium">98%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                      <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-white to-primary" />
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10 mb-6" />

                  {/* Mini stats */}
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <StatItem value="2" label="Pays" />
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <StatItem value="5 j" label="Express" />
                    <div className="w-px h-full bg-white/10 mx-auto" />
                    <StatItem value="7j/7" label="Support" />
                  </div>

                  {/* Tag pills */}
                  <div className="mt-8 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      SUIVI EN TEMPS RÉEL
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                      <Shield className="w-3 h-3 text-primary" />
                      ENVOI SÉCURISÉ
                    </div>
                  </div>
                </div>
              </div>

              {/* Marquee card */}
              <div
                style={{ animationDelay: "0.6s" }}
                className="hero-fade-in relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl"
              >
                <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Nos services</h3>
                <div
                  className="relative flex overflow-hidden"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  }}
                >
                  <div className="animate-hero-marquee flex gap-12 whitespace-nowrap px-4">
                    {[...SERVICES, ...SERVICES].map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default"
                      >
                        <service.icon className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-white tracking-tight">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
