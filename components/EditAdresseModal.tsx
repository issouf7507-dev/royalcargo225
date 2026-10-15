import { useState } from "react";
import { Button, Field, Input, Modal, Select } from "@/components/admin/ui";
import { STATUTS, statut } from "@/components/admin/status";

interface EditAdresseModalProps {
  open: boolean;
  onClose: () => void;
  adresse: {
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
    volume: number | null;
    prix: number | null;
    images: { id: string; url: string }[];
    codeTracking: string;
    etat: string;





  };
  onSave: (data: {
    status: string;
    poids: number | null;
    prix: number | null;
    volume: number | null;
    nombreColis: number | null;
    dateDepart: string | null;
    dateArrivee: string | null;
    nbProduits: number | null;
    images?: File[];
  }) => void;
  // onSMS: (phoneNumber: string, message: string) => void;
  onImageDelete?: (imageId: string) => void;
}

export default function EditAdresseModal({
  open,
  onClose,
  adresse,
  onSave,
  onImageDelete,
  // onSMS,
}: EditAdresseModalProps) {
  const [formData, setFormData] = useState({
    status: adresse.status,
    poids: adresse.poids || "",
    prix: adresse.prix || "",
    volume: adresse.volume || "",
    nombreColis: "",
    dateDepart: new Date().toISOString().slice(0, 10),
    dateArrivee: "",
  });
  const isColisEnvoye = formData.status === "Colis envoye";
  const isEnvoiMaritime = isColisEnvoye && adresse.service === "Envoie Maritime";
  const isEnvoiExpress = isColisEnvoye && adresse.service === "Envoie express";
  // Envoi express : nombre de produits (1 à 9)
  const [nbProduits, setNbProduits] = useState(1);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);







  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      status: formData.status,
      poids: formData.poids ? Number(formData.poids) : null,
      prix: formData.prix ? Number(formData.prix) : null,
      volume: formData.volume ? Number(formData.volume) : null,
      nombreColis: formData.nombreColis ? Number(formData.nombreColis) : null,
      dateDepart: isEnvoiMaritime ? formData.dateDepart || null : null,
      dateArrivee: formData.dateArrivee || null,
      nbProduits: isEnvoiExpress ? nbProduits : null,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    });

   
    


   
  };

  const handleImagesUploaded = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const s = statut(formData.status);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier l'adresse"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" form="edit-adresse">
            Enregistrer
          </Button>
        </>
      }
    >
      {/* Rappel du client concerné */}
      <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-slate-900/[0.04] px-3 py-2.5 ring-1 ring-slate-900/[0.06]">
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{adresse.nom}</p>
          <p className="truncate text-xs text-slate-500">
            {adresse.tel} · {adresse.service}
          </p>
        </div>
        {adresse.codeTracking && (
          <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 font-mono text-xs text-slate-700 ring-1 ring-slate-900/10">
            {adresse.codeTracking}
          </span>
        )}
      </div>

      <form id="edit-adresse" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Statut" className="sm:col-span-2">
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={STATUTS.map(({ value, label }) => ({
              value,
              label: value === "Arrive à Abidjan" ? "Arrivé à Abidjan (Côte d'Ivoire)" : label,
            }))}
            dot={s.dot}
          />
        </Field>

        <Field label="Poids (kg)">
          <Input
            type="number"
            step="0.01"
            value={formData.poids}
            onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
          />
        </Field>

        <Field label="Prix (XOF)">
          <Input
            type="number"
            step="0.01"
            value={formData.prix}
            onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
          />
        </Field>

        {isEnvoiMaritime && (
          <>
            <Field label="Nombre de colis">
              <Input
                type="number"
                min="1"
                value={formData.nombreColis}
                onChange={(e) => setFormData({ ...formData, nombreColis: e.target.value })}
              />
            </Field>

            <Field label="CBM (m³)">
              <Input
                type="number"
                step="0.001"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              />
            </Field>
          </>
        )}

        {isEnvoiExpress && (
          <fieldset className="flex flex-col gap-2 sm:col-span-2">
            <legend className="mb-2 text-[13px] font-medium leading-none text-slate-800">Nombre de produits</legend>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                <label
                  key={n}
                  className={`flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium ring-1 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500 ${
                    nbProduits === n
                      ? "bg-brand-700 text-white ring-brand-700"
                      : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="nbProduits"
                    value={n}
                    checked={nbProduits === n}
                    onChange={() => setNbProduits(n)}
                    className="sr-only"
                  />
                  {n}
                </label>
              ))}
            </div>
            <span className="text-xs text-slate-500">Indiqué dans le SMS envoyé au client.</span>
          </fieldset>
        )}

        {isEnvoiMaritime && (
          <>
            <Field label="Date de départ" hint="Indiquée dans le SMS envoyé au client.">
              <Input
                type="date"
                required
                value={formData.dateDepart}
                onChange={(e) => setFormData({ ...formData, dateDepart: e.target.value })}
              />
            </Field>

            <Field label="Date d'arrivée estimée">
              <Input
                type="date"
                required
                min={formData.dateDepart || undefined}
                value={formData.dateArrivee}
                onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
              />
            </Field>
          </>
        )}

        {isColisEnvoye && !isEnvoiMaritime && (
          <Field label="Date d'arrivée prévue" className="sm:col-span-2" hint="Indiquée dans le SMS envoyé au client.">
            <Input
              type="date"
              value={formData.dateArrivee}
              onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
            />
          </Field>
        )}

        {/* <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <ImageUpload
            onImagesUploaded={handleImagesUploaded}
            existingImages={adresse.images}
            onImageDelete={onImageDelete}
          />
        </div> */}
      </form>
    </Modal>
  );
}
