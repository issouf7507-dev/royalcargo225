"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, X } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Noto_Sans_SC } from "next/font/google";
import Image from "next/image";
import { toast } from "sonner";

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-sc",
});

export default function FindRequestModal({
  openSuccess,
  onCloseSuccess,
  data,
}: {
  openSuccess: boolean;
  onCloseSuccess: () => void;
  data: {
    nom: string;
    tel: string;
    pays: string;
    service: string;
    status: string;
    codeTracking: string;
    date: string;
    images: { url: string; description?: string }[];
    error: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; description?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log(data.error);



  // if(data.error =="Code de tracking introuvable"){
  //   setError(data.error);
  // }
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const handlePrintAdresse = useReactToPrint({
    contentRef: gridRef,
  });

  const handleCopy = () => {
    if (gridRef.current) {
      const text = gridRef.current.innerText;
      navigator.clipboard.writeText(text);
      toast.success("Contenu copié avec succès !");
    }
  };

  const handleShare = () => {
    if (gridRef.current) {
      const textToShare = gridRef.current.innerText;
      if (navigator.share) {
        navigator
          .share({
            title: "Adresse",
            text: textToShare,
          })
          .then(() => {
            console.log("Partage réussi !");
          })
          .catch((error) => {
            console.error("Erreur lors du partage :", error);
          });
      } else {
        alert(
          "La fonction de partage n'est pas prise en charge par votre navigateur."
        );
      }
    }
  };

  const handleClose = () => {
    onCloseSuccess();
  };

  //   MT-7CHWNTC13C
  const handleCopy2 = () => {
    navigator.clipboard.writeText(data.codeTracking);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={openSuccess} onOpenChange={handleClose}>
      <DialogContent className="w-full bg-gray-900 text-center p-6 rounded-xl border-none h-full overflow-y-auto">
        {data.error == "Code de tracking introuvable" ? (
          <div className="p-4">
            <div className="flex justify-center items-center">
              <Image
                className="w-50 h-40 object-contain"
                src="/logo.png"
                objectFit="contain"
                width={200}
                height={200}
                alt="log"
              />
            </div>
            <div className="text-red-500 text-xl font-bold mb-4">
              Code de tracking introuvable
            </div>
            <p className="text-gray-400 mb-6">
              Le code de tracking que vous avez saisi n'existe pas dans notre système.
              Veuillez vérifier le code et réessayer.
            </p>
            <Button
              onClick={handleClose}
              className="mt-6 bg-primary text-white w-full"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <>
                <div ref={componentRef} className="p-4">
                  <div className="flex justify-center items-center">
                    <Image
                      className="w-50 h-40 object-contain"
                      src="/logo.png"
                      objectFit="contain"
                      width={200}
                      height={200}
                      alt="log"
                    />
                  </div>
                  <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2 text-gray-400">
                    Demande envoyée avec succès !
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Voici les détails de votre demande :
                  </p>

                  <div className="text-left space-y-2">
                    <p className="text-gray-400">
                      <strong>Nom :</strong> {data.nom}
                    </p>
                    <p className="text-gray-400">
                      <strong>Téléphone :</strong> {data.tel}
                    </p>
                    <p className="text-gray-400">
                      <strong>Pays :</strong> {data.pays}
                    </p>
                    <p className="text-gray-400">
                      <strong>Service :</strong> {data.service}
                    </p>
                    <p className="text-gray-400">
                      <strong>Date :</strong> {new Date(data.date).toLocaleString()}
                    </p>


                    <div className="flex items-center gap-2">
                      <strong className="text-gray-400">Code Tracking :</strong>
                      <span className="font-mono text-primary text-gray-400">
                        {data.codeTracking}
                      </span>
                      <button onClick={handleCopy2} title="Copier">
                        <Copy
                          size={18}
                          className="text-gray-400 hover:text-black"
                        />
                      </button>
                      {copied && (
                        <span className="text-green-500 text-sm">Copié !</span>
                      )}
                    </div>

                    {data.images && data.images.length > 0 && (
                      <div className="mt-4">
                        <strong className="text-gray-400 block mb-2">Images :</strong>
                        <div className="grid grid-cols-2 gap-4">
                          {data.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square cursor-pointer"
                              onClick={() => setSelectedImage(image)}
                            >
                              <Image
                                src={image.url}
                                alt={image.description || `Image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg hover:opacity-90 transition-opacity"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleClose}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={handlePrint}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Imprimer
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Voir adresse
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div
                  ref={gridRef}
                  // className="grid p-4"
                  className={`grid p-4 ${notoSansSC.className}`}
                >
                  <div className="flex justify-center items-center">
                    <Image
                      className="w-50 h-40 object-contain"
                      src="/logo.png"
                      objectFit="contain"
                      width={200}
                      height={200}
                      alt="log"
                    />
                  </div>
                  {data.service == "Envoie Maritime" ? (<div>
                    <p className="text-gray-400">《客户的运输标记必须写在包装的每一件物品上，否则，如果货物未在我们的仓库中被发现，我们将不承担任何责任，并且送货代理必须从仓库领取送货单。》 </p>
                    <p className="text-gray-400">入仓号： TCM- RCG</p>
                    <p className="text-gray-400">Numéro d'entrepôt : TCM-RCG</p>


                    <p className="text-gray-400">客人埋头： 名字+国家电话</p>
                    <p className="text-gray-400">Informations client : ( {data.nom} {data.tel} {data.service} )</p>

                    <p className="text-gray-400">地址: 广东省佛山市南海区里水镇河塱沙路D2仓。</p>
                    <p className="text-gray-400">Adresse: 广东省佛山市南海区里水镇河塱沙路D2仓。</p>

                    <p className="text-gray-400">电话： +86 18664541357 (微信) </p>


                  </div>) : (
                    <div>
                      <p className="text-gray-400">
                        重要须知（埋头）: 包装上必须写明客户的姓名和国外电话号码。
                      </p>
                      <p className="text-gray-400">
                        客户姓名和编号 : ({data.nom} {data.tel} {data.service})
                      </p>
                      <p className="text-gray-400">是否有内置电池。</p>
                      <p className="text-gray-400">
                        中国广州市越秀区环市中路205号恒生大厦B座903-2
                      </p>
                      <p className="text-gray-400">
                        电话 : +86 186 2097 5453 / +86 188 0207 2454
                      </p>
                      <p className="text-gray-400">注意：不接受快递费。</p>
                      <p className="text-gray-400">收货时间: 12.00 - 20.30</p>
                      <p className="text-gray-400">违禁品将被拒收。</p>
                      <p className="text-gray-400">
                        如有虚假申报，在机场进行虚假申报或扣押货物的所有相关费用均由当事人自行承担！
                      </p>
                    </div>
                  )}

                  <br />


                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep(1)}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Retour
                  </Button>

                  <Button
                    onClick={handlePrintAdresse}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Imprimer
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Partager
                  </Button>
                  <Button
                    onClick={handleCopy}
                    className="mt-6 bg-primary text-white w-full"
                  >
                    Copier
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>

      {/* Modal pour l'image en grand */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full bg-gray-900 p-0 border-none">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            {selectedImage && (
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.description || "Image en grand"}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
