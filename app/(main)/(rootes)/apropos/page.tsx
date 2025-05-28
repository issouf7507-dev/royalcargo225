"use client";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
const Page = () => {
  return (
    <section>
      <div className="h-[60vh] flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.25, 0.25, 0.75],
          }}
          className="text-center  text-3xl font-bold text-[#1a76cb]  md:text-6xl"
        >
          A propos de nous & <br /> conditions d'utilisations
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "tween",
          duration: 0.8,
          delay: 0.6,
          ease: [0.25, 0.25, 0.25, 0.75],
        }}
        className="flex flex-col gap-10  px-10  md:px-28"
      >
        <div>
          <h2 className="text-start text-2xl font-bold text-[#1a76cb] mb-2 md:text-3xl">
            Qui sommes nous ?
          </h2>
          <p>
            Besoin d'aide pour suivre votre colis depuis la Chine jusqu'à votre
            porte ? Notre équipe logistique est là pour vous ! Contactez-nous
            dèsmaintenant pour une assistance rapide et efficace. Nous sommes là
            pour vous accompagner à chaque étape de votre expérience d'achat en
            ligne. Votre satisfaction est notre priorité numéro un.
          </p>
        </div>

        <div>
          <h2 className="text-start text-2xl font-bold text-[#1a76cb] mb-2 md:text-3xl">
            Frais d'entreposage
          </h2>
          <p>
            Veuillez noter qu'à partir du septième jour suivant la réception de
            votre colis par notre entrepôt, des frais d'entreposage seront
            appliqués. Ces frais couvrent les coûts liés au stockage de votre
            colis, tels que l'espace d'entreposage, la manutention et la
            sécurité. Le montant des frais d'entreposage est de 2000fr par jour.
            Pour éviter ces frais, nous vous recommandons de récupérer votre
            colis dans les 7 jours suivant sa réception. Vous pouvez suivre
            l'état de votre colis et organiser sa récupération en vous
            connectant à votre compte client sur notre site web
            [royalcargo225.com ] ou en nous contactant au +225 0564919216.
            Informations supplémentaires sur les frais d'entreposage :Les frais
            d'entreposage sont facturés par jour calendaire, incluant les
            week-ends et jours fériés.Les frais d'entreposage commencent à
            s'appliquer à partir du 7eme jour ouvré suivant la réception de
            votre colis.Si vous ne récupérez pas votre colis dans les 7 jours
            suivant sa réception, nous nous réservons le droit de le renvoyer à
            l'expéditeur ou de le détruire.Les frais d'entreposage ne sont pas
            remboursables. Nous vous remercions pour votre compréhension et
            votre coopération.
          </p>
        </div>

        <div>
          <h2 className="text-start text-2xl font-bold text-[#1a76cb] mb-2 md:text-3xl">
            Faciliter l'envoi de votre colis
          </h2>
          <p>
            Afin de garantir un envoi fluide et une livraison réussie de votre
            colis, veuillez suivre attentivement ces étapes : 1. Remplir les
            informations du site * Accédez au site web royalcargo225.com . *
            Identifiez la section : Expédition suivi du sous lien Expedition De
            Colis. * Saisissez les informations exactes qui vous serons demander
            dans la section Expedition. N’oubliez pas de sélectionner un service
            (Express, Normal, Maritime). En complétant soigneusement ces
            informations, vous contribuez à un acheminement rapide et précis de
            votre colis. 2. Obtenir la capture d'écran du reçu de confirmation
            de livraison de votre colis à l'entrepôt * Une fois l'expédition
            créée, votre numero de telephone sera votre numero de suivi. *
            Faites une capture d'écran du reçu de confirmation de livraison ou
            du bon de livraison. * Enregistrez la capture d'écran sur votre
            ordinateur ou votre appareil mobile. Cette capture d'écran servira
            de preuve en de problème. 3. Assurez-vous que les informations nom
            et numero de téléphone du pays sont bien collées sur le colis En
            apposant ces informations sur votre colis, vous facilitez son
            traitement et sa livraison au bon destinataire.
          </p>
        </div>

        <div>
          <h2 className="text-start text-2xl font-bold text-[#1a76cb] mb-2 md:text-3xl">
            Faciliter l'envoi de votre colis
          </h2>
          <p>
            Attention : Les colis contenant des batteries, des produits
            inflammables, des liquides et des médicaments en grande quantité
            sont strictement interdits dans les envois express et standard par
            avion. Cette restriction s'applique à tous les types de colis,
            qu'ils soient personnels ou commerciaux. Le non-respect de cette
            réglementation peut entraîner des retards significatifs, des frais
            supplémentaires, voire la destruction de votre colis. Exemples
            d'Articles Interdits :Batteries : Batteries lithium-ion : Piles
            rechargeables pour appareils électroniques comme les ordinateurs
            portables, les smartphones et les tablettes.Batteries lithium métal
            : Piles non rechargeables pour montres, jouets et petits appareils
            électroniques.Produits inflammables : Liquides, gaz et solides
            inflammables tels que l'essence, le propane, les allumettes et les
            briquets.Produits liquides : Liquides en grande quantité, comme
            l'eau, les produits chimiques et les boissons.Aérosols et produits
            sous pression, tels que les déodorants, les produits de nettoyage et
            les extincteurs.Médicaments : Médicaments sur ordonnance et en vente
            libre en grande quantité.Substances contrôlées et stupéfiants. Pour
            plus d'informations sur les articles interdits à l'expédition par
            avion, veuillez consulter les directives de la compagnie aérienne
            utilisée.
          </p>
        </div>
      </motion.div>
      <Footer />
    </section>
  );
};

export default Page;
