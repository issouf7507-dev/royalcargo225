"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditAdresseModal from "@/components/EditAdresseModal";
import { LogOut, Search } from "lucide-react";
import axios from "axios";


interface Adresse {
  id: string;
  nom: string;
  tel: string;
  email: string | null;
  pays: string;
  type: string;
  status: string;
  date: string | null;
  description: string;
  service: string;
  poids: number | null;
  prix: number | null;
  images: { id: string; url: string }[];
  codeTracking: string;
  etat: string;
}

export default function AdressesPage() {
  const [adresses, setAdresses] = useState<Adresse[]>([]);
  const [filteredAdresses, setFilteredAdresses] = useState<Adresse[]>([]);
  const [error, setError] = useState("");
  const [selectedAdresse, setSelectedAdresse] = useState<Adresse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const router = useRouter();






  useEffect(() => {
    fetchAdresses();
  }, []);

  useEffect(() => {
    filterAdresses();
  }, [adresses, searchTerm, filterStatus]);


  const shortCode = "+2250713441784";
  let accessToken: any = null;
  let tokenExpires: any = null;

  const handleClickR = async () => {
    try {
      const response = await fetch("/api/bulksms", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }
      accessToken = data.access_token;
    } catch (error) {
      console.error("Erreur lors de l'appel de l'API:", error);
    }
  };

  const sendSMS = async (phoneNumber: string, message: string) => {

    await handleClickR();


    try {
      await axios.post(
        `https://api.orange.com/smsmessaging/v1/outbound/tel:+2250713441784/requests`,
        {
          outboundSMSMessageRequest: {
            address: `tel:+225${phoneNumber}`,
            senderAddress: `tel:${shortCode}`,
            outboundSMSTextMessage: {
              message: message,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // setStatus('SMS sent successfully');
    } catch (error) {
      console.error("Error sending SMS:", error);
      // setStatus('Failed to send SMS');
    }
  };

  const filterAdresses = () => {
    let filtered = [...adresses];

    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (adresse) =>
          adresse.nom.toLowerCase().includes(searchLower) ||
          adresse.tel.toLowerCase().includes(searchLower) ||
          adresse.pays.toLowerCase().includes(searchLower) ||
          adresse.type.toLowerCase().includes(searchLower) ||
          adresse.service.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par statut
    if (filterStatus) {
      filtered = filtered.filter((adresse) => adresse.status === filterStatus);
    }

    setFilteredAdresses(filtered);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        setError("Erreur lors de la déconnexion");
      }
    } catch (err) {
      setError("Erreur lors de la déconnexion");
    }
  };

  const fetchAdresses = async () => {
    try {
      const response = await fetch("/api/adresses");
      if (response.ok) {
        const data = await response.json();
        setAdresses(data);
        setFilteredAdresses(data);
      } else {
        setError("Erreur lors du chargement des adresses");
      }
    } catch (err) {
      setError("Erreur lors du chargement des adresses");
    }
  };

  const handleEdit = (adresse: Adresse) => {
    setSelectedAdresse(adresse);
    setIsEditModalOpen(true);
  };

  const handleSave = async (data: {
    status: string;
    poids: number | null;
    prix: number | null;
    images?: File[];
  }) => {
    if (!selectedAdresse) return;

    try {
      const formData = new FormData();
      formData.append("status", data.status);
      if (data.poids) formData.append("poids", data.poids.toString());
      if (data.prix) formData.append("prix", data.prix.toString());
      if (data.images) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await fetch(`/api/adresses/${selectedAdresse.id}`, {
        method: "PATCH",
        body: formData,
      });


 const dataresponse = await response.json();

      if (response.ok) {
        fetchAdresses();
        setIsEditModalOpen(false);
        setSelectedAdresse(null);
      } else {
        setError("Erreur lors de la modification");
      }


      if(dataresponse){
        sendSMS(
          dataresponse?.tel,
          `ROYAL CARGO \nBONJOUR CHER CLIENT (${dataresponse.nom}). NOUS SOMMES RAVIS DE VOUS ANNONCER QUE LE STATUT DE VOTRE COLIS À CHANGER, IL EST MAINTENANT PASSER À **${dataresponse.status.toUpperCase()}**.\nPOUR PLUS DE DÉTAILS RENDEZ-VOUS sur royalcargor225.com AVEC VOTRE NUMÉRO DE SUIVI: ${dataresponse.codeTracking}`
        );
      }

    } catch (err) {
      setError("Erreur lors de la modification");
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdresses();
      } else {
        setError("Erreur lors de la suppression de l'image");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/adresses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdresses();
      } else {
        setError("Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8 mt-16">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Liste des Adresses</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, pays, type ou service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-900 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente de réception">En attente de réception</option>
          <option value="Colis reçu">Colis reçu</option>
          <option value="Colis envoye">Colis envoyé</option>
          <option value="Arrive à Abidjan">Arrivé à Abidjan</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto rounded-lg shadow">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full bg-gray-900 border rounded-lg text-white">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Pays
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Poids
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Code
                  </th>
                  {/* {filteredAdresses.some(adresse => adresse.images && adresse.images.length > 0) && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Images
                    </th>
                  )} */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAdresses.map((adresse) => (
                  <tr key={adresse.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">{adresse.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{adresse.tel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{adresse.pays}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{adresse.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{adresse.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          adresse.status === "En attente de réception"
                            ? "bg-yellow-100 text-yellow-800"
                            : adresse.status === "Colis reçu"
                            ? "bg-blue-100 text-blue-800"
                            : adresse.status === "Colis envoye"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {adresse.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {adresse.poids ? `${adresse.poids} kg` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {adresse.prix ? `${adresse.prix} XOF` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {adresse.codeTracking ? `${adresse.codeTracking}` : "-"}
                    </td>
                    {/* {filteredAdresses.some(adresse => adresse.images && adresse.images.length > 0) && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {adresse.images && adresse.images.length > 0 ? (
                          <div className="flex -space-x-2">
                            {adresse.images.slice(0, 3).map((image) => (
                              <img
                                key={image.id}
                                src={image.url}
                                alt=""
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {adresse.images.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs">
                                +{adresse.images.length - 3}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </td>
                    )} */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(adresse)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(adresse.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedAdresse && (
        <EditAdresseModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdresse(null);
          }}
          adresse={selectedAdresse}
          onSave={handleSave}
          onImageDelete={handleImageDelete}
          // onSMS={sendSMS}
        />
      )}
    </div>
  );
}
