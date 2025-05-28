"use client";
import AdresseModal from "./AdresseModal";
import FindRequestModal from "./FindRequestModal";
import { useState } from "react";

const partners = [
  { name: "OXFAM", logo: "/logos/oxfam.svg" },
  { name: "DT Global", logo: "/logos/dtglobal.svg" },
  { name: "NAYBA", logo: "/logos/nayba.svg" },
  { name: "MOVE", logo: "/logos/move.svg" },
  { name: "Ferguson", logo: "/logos/ferguson.svg" },
];

export default function Hero() {
  const [codeT, setCodeT] = useState<string>("");
  const [successData, setSuccessData] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
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
        console.log(data);

        setSuccessData({
          nom: data.request.nom,
          tel: data.request.tel,
          pays: data.request.pays,
          service: data.request.service,
          status: data.request.status,
          codeTracking: data.request.codeTracking, // doit être retourné par l'API
          date: data.request.date,
        });

        setCodeT("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {successData && (
        <FindRequestModal
          openSuccess={!!successData}
          onCloseSuccess={() => {
            setSuccessData(null);
          }}
          data={successData}
        />
      )}

      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />
      <section className="w-full bg-gray-900 py-12 md:py-20 px-10 lg:px-0 h-screen relative overflow-hidden">
        {/* Background illustrations */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main content */}
            <div className="flex flex-col items-center gap-8 animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Livrer votre cargaison <br />
                <span className="text-primary">Mondial</span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Recevez vos colis de la Chine vers la Côte d'Ivoire ou Le Mali
                en toute sécurité et garantie. Suivi, rapidité et fiabilité pour
                tous vos besoins logistiques.
              </p>

              {/* Container image */}

              {/* Tracking form */}
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Suivi de colis
                  </h3>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleRequest}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Numéro de suivi"
                        value={codeT}
                        onChange={(e) => setCodeT(e.target.value)}
                        className="w-full px-5 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400 animate-bounce"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-orange-600  shadow-md transform hover:scale-105 transition-transform"
                    >
                      Suivre mon colis
                    </button>
                  </form>
                </div>
              </div>

              {/* Request address button */}
              <button
                className="mt-6 px-8 py-3 rounded-full bg-transparent text-primary border-2 border-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-md transform hover:scale-105"
                onClick={() => setAdresseOpen(true)}
              >
                Demande d'adresse
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
