"use client";
import { useState } from "react";
// import { Dialog } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { serviceCoteDivoire, serviceMali } from "@/app/constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import SuccessModal from "./SuccessModal";

const servicesByCountry = {
  COTE_D_IVOIRE: serviceCoteDivoire,
  MALI: serviceMali,
};

export default function AdresseModal({
  open,
  onClose,
  setAdresseOpen,
}: {
  open: boolean;
  onClose: () => void;
  setAdresseOpen: (open: boolean) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [service, setService] = useState<any>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [form, setForm] = useState({
    nom: "",
    tel: "",
    type: "",
    pays: "",
    service: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setStep(1);
    setCountry("");
    setService(null);
    setForm({ nom: "", tel: "", type: "", pays: "", service: "" });
    onClose();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newForm = {
      ...form,
      pays: country,
      service: service.title,
      status: "EN_ATTENTE",
    };

    try {
      const res = await fetch("/api/requestservice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (!res.ok) throw new Error("Échec lors de l'envoi");

      const data = await res.json();

      // console.log("✅ Succès :", data);

      if (data.message === "Adresse créée avec succès") {
        console.log("✅ Succès :", data);
        setStatus("success");
        setForm({ nom: "", tel: "", type: "", pays: "", service: "" });
        setStep(1);
        setCountry("");
        setService(null);

        setSuccessData({
          nom: data.data.nom,
          tel: data.data.tel,
          pays: data.data.pays,
          service: data.data.service,
          status: data.data.status,
          codeTracking: data.data.codeTracking, // doit être retourné par l'API
          date: data.data.date,
        });
      }
      // handleClose();

      // Optionnel : Fermer le modal après un court délai
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  // const [step, setStep] = useState<1 | 2 | 3>(1);
  return (
    <div>
      {successData && (
        <SuccessModal
          setStep={setStep}
          step={step}
          openSuccess={!!successData}
          onCloseSuccess={() => {
            setSuccessData(null);
          }}
          data={successData}
        />
      )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className={`" overflow-y-auto  bg-gray-900 border-none " ${
            step === 2 || step === 3
              ? " h-full  md:h-[600px]"
              : " h-full md:h-80"
          }`}
        >
          <div className="fixed inset-0 flex items-center justify-center  px-2">
            <div className="rounded-2xl  max-w-lg w-full p-6 bg-gray-900/20 relative animate max-h-[90vh] overflow-y-auto">
              {/* Step 1: Choix du pays */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Choisissez votre pays
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                      className={`flex-1 p-6 rounded-xl  ${
                        country === "COTE_D_IVOIRE"
                          ? "border-primary bg-primary/10"
                          : " bg-gray-800"
                      } shadow hover:shadow-lg transition-all flex flex-col items-center`}
                      onClick={() => {
                        setCountry("COTE_D_IVOIRE");
                        setStep(2);
                      }}
                    >
                      <span className="text-6xl mb-2">🇨🇮</span>
                      <span className="font-semibold text-lg text-gray-400">
                        Côte d'Ivoire
                      </span>
                    </button>
                    <button
                      className={`flex-1 p-6 rounded-xl  ${
                        country === "MALI"
                          ? "border-primary bg-primary/10"
                          : " bg-gray-800"
                      } shadow hover:shadow-lg transition-all flex flex-col items-center`}
                      onClick={() => {
                        setCountry("MALI");
                        setStep(2);
                      }}
                    >
                      <span className="text-6xl mb-2">🇲🇱</span>
                      <span className="font-semibold text-lg text-gray-400">
                        Mali
                      </span>
                    </button>
                  </div>
                </>
              )}
              {/* Step 2: Choix du service */}
              {step === 2 && country && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-center text-white">
                    Services disponibles pour{" "}
                    {country === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : "Mali"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {servicesByCountry[
                      country as keyof typeof servicesByCountry
                    ].map((srv: any) => (
                      <button
                        key={srv.id}
                        className={`w-full p-4 rounded-xl  flex items-center gap-4 text-left shadow hover:shadow-lg transition-all ${
                          service?.id === srv.id
                            ? "border-primary bg-primary/10"
                            : " bg-gray-800"
                        }`}
                        onClick={() => {
                          setService(srv);
                          setStep(3);
                        }}
                      >
                        <span className="text-3xl text-primary ">
                          {srv.icons}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-200">
                            {srv.title}
                          </div>
                          <div className="text-gray-400 text-sm mb-1">
                            {srv.desc}
                          </div>
                          <div className="text-primary font-semibold">
                            {srv.price}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      className="text-white bg-primary"
                      onClick={() => setStep(1)}
                    >
                      &larr; Retour
                    </Button>
                  </div>
                </>
              )}
              {/* Step 3: Formulaire */}
              {step === 3 && service && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-center text-white">
                    Demande d'adresse - {country} / {service.title}
                  </h2>
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="nom"
                      placeholder="Nom"
                      value={form.nom}
                      onChange={handleFormChange}
                      className="p-3 rounded-lg border border-gray-700 text-white bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      required
                    />

                    {/* <input
                      type="tel"
                      name="tel"
                      placeholder="Téléphone (10 chiffres)"
                      value={form.tel}
                      onChange={handleFormChange}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      title="Le numéro de téléphone doit contenir exactement 10 chiffres"
                      className="p-3 rounded-lg border border-gray-700 text-white bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      required
                    /> */}

<input
  type="tel"
  name="tel"
  placeholder="Téléphone (8 à 10 chiffres)"
  value={form.tel}
  onChange={handleFormChange}
  pattern="^[0-9]{8,10}$"
  maxLength={10}
  minLength={8}
  title="Le numéro de téléphone doit contenir entre 8 et 10 chiffres"
  className="p-3 rounded-lg border border-gray-700 text-white bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
  required
/>
                    <input
                      type="text"
                      name="type"
                      placeholder="Type de colis"
                      value={form.type}
                      onChange={handleFormChange}
                      className="p-3 rounded-lg border border-gray-700 text-white bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="mt-2 px-5 py-3 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/80 transition-colors"
                    >
                      Envoyer la demandes
                    </button>
                  </form>

                  <div className="mt-4">
                    <Button
                      type="button"
                      className="text-white bg-primary"
                      onClick={() => setStep(2)}
                    >
                      &larr; Retour
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
