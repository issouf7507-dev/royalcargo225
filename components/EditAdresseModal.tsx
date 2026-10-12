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
    dateArrivee: string | null;
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
    dateArrivee: "",
  });
  const isColisEnvoye = formData.status === "Colis envoye";
  const isEnvoiMaritime = isColisEnvoye && adresse.service === "Envoie Maritime";
  const [selectedImages, setSelectedImages] = useState<File[]>([]);







  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      status: formData.status,
      poids: formData.poids ? Number(formData.poids) : null,
      prix: formData.prix ? Number(formData.prix) : null,
      volume: formData.volume ? Number(formData.volume) : null,
      nombreColis: formData.nombreColis ? Number(formData.nombreColis) : null,
      dateArrivee: formData.dateArrivee || null,
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

        {isColisEnvoye && (
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
