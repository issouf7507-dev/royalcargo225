"use client";
import AdresseModal from "./AdresseModal";
import FindRequestModal from "./FindRequestModal";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, MapPin, Clock, Shield } from "lucide-react";

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

      <section className="relative w-full min-h-screen bg-gray-950 overflow-hidden flex flex-col">
        {/* Ambient glow background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-60 -left-60 w-[700px] h-[700px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-28 pb-8">
          {/* Route badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold"
          >
            🌍 Chine → Côte d'Ivoire &amp; Mali
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-center leading-tight mb-6 max-w-4xl"
          >
            Livrez vos colis{" "}
            <br className="hidden md:block" />
            <span className="text-primary">simplement &amp; sûrement</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10 leading-relaxed"
          >
            Transport de cargaison depuis la Chine vers l'Afrique de l'Ouest.
            Suivi en temps réel, rapidité et fiabilité pour tous vos besoins logistiques.
          </motion.p>

          {/* Tracking form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="w-full max-w-xl mb-5"
          >
            <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Numéro de suivi (ex: RC-123456)"
                  value={codeT}
                  onChange={(e) => setCodeT(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                Suivre
              </button>
            </form>
          </motion.div>

          {/* Secondary CTA */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            onClick={() => setAdresseOpen(true)}
            className="px-8 py-3 rounded-full border-2 border-primary/40 text-primary font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
          >
            Demande d'adresse →
          </motion.button>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.6 }}
          className="relative z-10 border-t border-gray-800 bg-gray-900/60 backdrop-blur-sm"
        >
          <div className="max-w-4xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Package className="w-4 h-4 text-primary" />, value: "500+", label: "Colis traités" },
              { icon: <MapPin className="w-4 h-4 text-primary" />, value: "2", label: "Pays desservis" },
              { icon: <Clock className="w-4 h-4 text-primary" />, value: "5 jours", label: "Délai express" },
              { icon: <Shield className="w-4 h-4 text-primary" />, value: "7j/7", label: "Support client" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 md:border-l md:border-gray-800 md:first:border-0 md:pl-4 md:first:pl-0"
              >
                <div>{stat.icon}</div>
                <div>
                  <div className="text-white font-bold text-base">{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
