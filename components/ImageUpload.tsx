import { useState } from "react";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImagesUploaded: (images: File[]) => void;
  existingImages?: { url: string; id: string }[];
  onImageDelete?: (imageId: string) => void;
}

export default function ImageUpload({
  onImagesUploaded,
  existingImages = [],
  onImageDelete,
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Créer des URLs de prévisualisation
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    // Notifier le parent des nouveaux fichiers
    onImagesUploaded(files);
  };

  const removePreview = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {existingImages.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt="Uploaded"
              className="w-24 h-24 object-cover rounded-lg"
            />
            {onImageDelete && (
              <button
                onClick={() => onImageDelete(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        {previewUrls.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              onClick={() => removePreview(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Upload size={16} />
          Ajouter des images
        </label>
      </div>
    </div>
  );
}
