import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import ImageUpload from "./ImageUpload";

interface EditAdresseModalProps {
  open: boolean;
  onClose: () => void;
  adresse: {
    id: string;
    status: string;
    poids: number | null;
    prix: number | null;
    images?: { url: string; id: string }[];
  };
  onSave: (data: {
    status: string;
    poids: number | null;
    prix: number | null;
    images?: File[];
  }) => void;
  onImageDelete?: (imageId: string) => void;
}

export default function EditAdresseModal({
  open,
  onClose,
  adresse,
  onSave,
  onImageDelete,
}: EditAdresseModalProps) {
  const [formData, setFormData] = useState({
    status: adresse.status,
    poids: adresse.poids || "",
    prix: adresse.prix || "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      status: formData.status,
      poids: formData.poids ? Number(formData.poids) : null,
      prix: formData.prix ? Number(formData.prix) : null,
      images: selectedImages.length > 0 ? selectedImages : undefined,
    });
  };

  const handleImagesUploaded = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'adresse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="En attente de réception">
                En attente de réception
              </option>
              <option value="Colis reçu">Colis reçu</option>
              <option value="Colis envoye">Colis envoyé</option>
              <option value="Arrive à Abidjan">
                Arrivé à Abidjan (Côte d'Ivoire)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Poids (kg)</label>
            <input
              type="number"
              step="0.01"
              value={formData.poids}
              onChange={(e) =>
                setFormData({ ...formData, poids: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              value={formData.prix}
              onChange={(e) =>
                setFormData({ ...formData, prix: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <ImageUpload
              onImagesUploaded={handleImagesUploaded}
              existingImages={adresse.images}
              onImageDelete={onImageDelete}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
