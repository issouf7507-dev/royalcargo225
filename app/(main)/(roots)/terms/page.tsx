import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Royal Cargo",
  description: "Conditions d'utilisation de Royal Cargo - Service de transport et logistique",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-16">
      <h1 className="text-3xl font-bold mb-8 text-center text-white ">Conditions d'utilisation</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptation des conditions</h2>
          <p className="text-gray-500">
            En accédant et en utilisant ce site web, vous acceptez d'être lié par les présentes conditions d'utilisation.
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">2. Services proposés</h2>
          <p className="text-gray-500">
            Royal Cargo propose des services de transport et de logistique. Les services spécifiques
            sont décrits sur notre site web et peuvent être modifiés à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">3. Utilisation du service</h2>
          <p className="text-gray-500">
            Vous acceptez d'utiliser notre service conformément à toutes les lois et réglementations applicables.
            Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">4. Confidentialité</h2>
          <p className="text-gray-500">
            Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.
            Les informations que vous nous fournissez sont utilisées uniquement dans le cadre de nos services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">5. Limitation de responsabilité</h2>
          <p className="text-gray-500">
            Royal Cargo ne peut être tenu responsable des dommages indirects résultant de l'utilisation
            ou de l'impossibilité d'utiliser notre service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">6. Modifications des conditions</h2>
          <p className="text-gray-500">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
            entrent en vigueur dès leur publication sur le site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">7. Contact</h2>
          <p className="text-gray-500">
            Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter
            via notre formulaire de contact ou par email.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
} 