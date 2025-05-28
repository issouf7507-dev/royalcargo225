"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { number } from "zod";
import Hero from "@/components/Hero";
import { Plane, Ship } from "lucide-react";
import Image from "next/image";
import AdresseModal from "@/components/AdresseModal";
import FindRequestModal from "@/components/FindRequestModal";

const serviceCoteDivoire = [
  {
    id: 1,
    icons: <Plane className="w-6 h-6 text-primary" />,
    title: "Envoie express",
    desc: "Vos colis arrivent à destination en un clin d'œil. (5 jours)",
    price: "12 000 FR/KG",
  },
  {
    id: 2,
    icons: <Plane className="w-6 h-6 text-primary" />,
    title: "Envoie Normal",
    desc: "Profitez de tarifs avantageux pour vos envois de 2 semaines.",
    price: "9 000 FR/KG",
  },
  {
    id: 3,
    icons: <Ship className="w-6 h-6 text-primary" />,
    title: "Envoie Maritime",
    desc: "Vos colis traversent les océans en toute sérénité.",
    price: "CBM (M³)",
  },
];

const serviceMali = [
  {
    id: 1,
    icons: <Plane className="w-6 h-6 text-primary" />,
    title: "Envoie express",
    desc: "Vos colis arrivent à destination en un clin d'œil. (5 jours)",
    price: "12 000 FR/KG",
  },
  {
    id: 2,
    icons: <Plane className="w-6 h-6 text-primary" />,
    title: "Envoie Normal",
    desc: "Profitez de tarifs avantageux pour vos envois de 2 semaines.",
    price: "9 000 FR/KG",
  },
];

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [adresseOpen, setAdresseOpen] = useState(false);

  const [country, setCountry] = useState("civ");

  const services = country === "civ" ? serviceCoteDivoire : serviceMali;

  const [service, setService] = useState<string>("");
  const [codeT, setCodeT] = useState<string>("");
  const [successData, setSuccessData] = useState<any | null>(null);
  const navigate = useRouter();

  const handleItemClick = (el: any) => {
    // e.stopPropagation();
    setIsDialogOpen(true);
    setService(el);
  };

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

      <Hero />
      {/* Tarifs */}
      <section className="w-full bg-gray-900 py-16 px-10 lg:px-0" id="tarifs">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nos Tarifs
          </h2>
          <p className="text-gray-300 mb-10">
            Choisissez votre destination pour voir les tarifs disponibles.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                country === "civ"
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => setCountry("civ")}
            >
              Côte d'Ivoire
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                country === "mali"
                  ? "bg-primary text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => setCountry("mali")}
            >
              Mali
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-700 rounded-xl p-6 text-left shadow hover:shadow-md transition bg-gray-800"
              >
                <div className="mb-4">{service.icons}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4">{service.desc}</p>
                <p className="text-primary font-semibold">{service.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-orange-600 transition shadow-md"
              onClick={() => setAdresseOpen(true)}
            >
              Demander un devis
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="w-full bg-gray-900 py-16 px-10 lg:px-0">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Nos Services
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Une solution logistique complète pour garantir l'acheminement
            sécurisé et rapide de vos colis de la Chine vers l'Afrique de
            l'Ouest.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Cards */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">🚢</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Transport maritime sécurisé
              </h3>
              <p className="text-gray-300 text-sm">
                Expédition de vos colis en conteneur ou groupage, avec suivi et
                assurance incluse.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Réception & stockage en Chine
              </h3>
              <p className="text-gray-300 text-sm">
                Une adresse dédiée pour centraliser vos achats, contrôler la
                qualité et organiser les envois.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Suivi en temps réel
              </h3>
              <p className="text-gray-300 text-sm">
                Accédez à l'état de vos colis en temps réel grâce à notre
                plateforme en ligne sécurisée.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">🛃</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Dédouanement simplifié
              </h3>
              <p className="text-gray-300 text-sm">
                Nous nous chargeons des formalités douanières à Abidjan ou
                Bamako pour une livraison fluide.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Livraison à domicile
              </h3>
              <p className="text-gray-300 text-sm">
                Livraison à votre adresse en Côte d'Ivoire ou au Mali avec des
                partenaires de confiance.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-all text-left border border-gray-700">
              <div className="text-primary mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Support client dédié
              </h3>
              <p className="text-gray-300 text-sm">
                Une équipe locale disponible 7j/7 pour répondre à vos questions
                et vous assister.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suivi */}
      <section className="w-full bg-gray-900 py-16 px-10 lg:px-0">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Suivi en temps réel
          </h2>
          <p className="text-gray-300 mb-8">
            Entrez votre numéro de suivi pour connaître le statut de votre
            cargaison.
          </p>
          <form
            className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-4"
            onSubmit={handleRequest}
          >
            <input
              type="text"
              placeholder="Ex: 123456789"
              className="flex-1 px-5 py-3 rounded-lg border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-white bg-gray-800 shadow-sm"
              value={codeT}
              onChange={(e) => setCodeT(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
              Suivre ma cargaison
            </button>
          </form>
          {/* Résultat simulé */}
          {/* <div className="mt-8 text-left bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        Résultat pour : 123456789
      </h4>
      <p className="text-sm text-gray-600">Statut : En transit (Arrivée prévue : 25 Mai)</p>
    </div> */}
        </div>
      </section>

      {/* À propos */}
      <section className="w-full bg-gray-900 py-20 px-10 lg:px-0" id="about">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Notre mission : relier les continents, simplifier la logistique
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Fondée avec la volonté de rapprocher l'Afrique de ses partenaires
              commerciaux, notre entreprise s'engage à offrir des services de
              transport de cargaisons sûrs, rapides et accessibles.
            </p>
            <p className="text-gray-400">
              Nous croyons en une logistique transparente, avec un suivi en
              temps réel, des tarifs clairs, et un accompagnement humain. Notre
              vision ? Devenir le pont incontournable entre la Chine, la Côte
              d'Ivoire et le Mali.
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Fiabilité & sécurité</li>
              <li>Transparence & confiance</li>
              <li>Engagement local & international</li>
            </ul>
          </div>

          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/team-warehouse.jpg"
              alt="Notre équipe logistique"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-900 py-20 px-10 lg:px-0" id="contact">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Contactez-nous
            </h2>
            <p className="text-gray-300">
              Vous avez une question ? Besoin d'un devis ou d'un accompagnement
              ? Notre équipe est disponible pour vous répondre rapidement.
            </p>

            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white">Adresse</h3>
                <p>
                  Boulevard du Cameroun, Ligne 11
                  <br />
                  Grand marché de Marcory, Abidjan, Côte d'Ivoire
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">Téléphones</h3>
                <ul className="space-y-1">
                  <li>📞 +225 0564919216</li>
                  <li>📞 +225 0708201212</li>
                  <li>🇨🇳 +86 186 2097 5453</li>
                  <li>🇨🇳 +86 188 0207 2454</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white">Email</h3>
                <p>📧 royalcargo225@gmail.com</p>
              </div>

              <div>
                <h3 className="font-semibold text-white">WhatsApp</h3>
                <a
                  href="https://wa.me/2250564919216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Envoyer un message
                </a>
              </div>
            </div>
          </div>

          <form className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-gray-900 text-white"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-gray-900 text-white"
                placeholder="Votre adresse email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-gray-900 text-white"
                placeholder="Votre message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </section>

      <AdresseModal
        open={adresseOpen}
        onClose={() => setAdresseOpen(false)}
        setAdresseOpen={setAdresseOpen}
      />
    </>
  );
}

// id 3YRAW8TPCLZMX2SLUY9Q29QJ
// number +17622426402
