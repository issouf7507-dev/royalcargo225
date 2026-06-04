import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

export interface Image {
  id: string;
  url: string;
  description?: string;
  adresseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RequestInterface {
  id: string;
  nom: string;
  tel: string;
  email?: string;
  pays: "COTE_D_IVOIRE" | "MALI";
  type: string;
  poids?: number;
  volume?: number;
  prix?: number;
  status: "EN_ATTENTE" | "COLIS_RECU" | "COLIS_EN_TRANSIT" | "COLIS_ARRIVE";
  date: Date;
  description: string;
  images: Image[];
  etat: string;
  codeTracking?: string;
  service: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RequestService {
  async generateUniqueCode(): Promise<string> {
    let code: string;
    let exists = true;

    while (exists) {
      code = `MT-${nanoid()}`;
      const found = await prisma.adresse.findUnique({
        where: { codeTracking: code },
      });
      exists = !!found;
    }

    return code!;
  }

  async createRequest(adresse: Omit<RequestInterface, "codeTracking">) {
    const codeTracking = await this.generateUniqueCode();
    const request = await prisma.adresse.create({
      data: {
        nom: adresse.nom,
        tel: adresse.tel,
        type: adresse.type,
        pays: adresse.pays,
        service: adresse.service,
        status: adresse.status,
        date: new Date(),
        description: "",
        etat: adresse.etat,
        codeTracking,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return request;
  }

  async getRequestByCode(codeTracking: string) {
    const request = await prisma.adresse.findUnique({
      where: { codeTracking },
      include: { images: true },
    });

    return request;
  }
}
