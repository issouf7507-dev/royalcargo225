import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const formData = await request.formData();
    const status = formData.get("status") as string;
    const poids = formData.get("poids") ? Number(formData.get("poids")) : null;
    const prix = formData.get("prix") ? Number(formData.get("prix")) : null;
    const images = formData.getAll("images") as File[];

    // Mise à jour des informations de base
    const updatedAdresse = await prisma.adresse.update({
      where: { id: params.id },
      data: {
        status,
        poids,
        prix,
      },
    });

    // Traitement des images
    if (images.length > 0) {
      const uploadPromises = images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Générer un nom de fichier unique
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${image.name}`;
        const path = join(process.cwd(), "public", "uploads", filename);

        // Sauvegarder le fichier
        await writeFile(path, buffer);

        // Créer l'entrée dans la base de données
        return prisma.image.create({
          data: {
            url: `/uploads/${filename}`,
            adresseId: params.id,
          },
        });
      });

      await Promise.all(uploadPromises);
    }

    // Récupérer l'adresse mise à jour avec les 
    // ssimages
    const finalAdresse = await prisma.adresse.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    return NextResponse.json(finalAdresse);
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers
      .get("cookie")
      ?.split("token=")[1]
      ?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    await prisma.adresse.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Adresse supprimée avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
