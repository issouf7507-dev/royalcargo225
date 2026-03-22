import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Use Next.js cookies() function for better cookie parsing
    const { cookies } = await import("next/headers");
    const token = cookies().get("token")?.value;

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
      const uploadDir = join(process.cwd(), "public", "uploads");

      // Vérifier si le dossier existe, sinon le créer
      if (!existsSync(uploadDir)) {
        console.log("Création du dossier uploads:", uploadDir);
        mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPromises = images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Générer un nom de fichier unique
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}-${image.name}`;
        const path = join(uploadDir, filename);

        console.log("Tentative d'écriture du fichier:", path);

        try {
          // Sauvegarder le fichier
          await writeFile(path, buffer);
          console.log("Fichier écrit avec succès:", path);

          // Créer l'entrée dans la base de données
          return prisma.image.create({
            data: {
              url: `/uploads/${filename}`,
              adresseId: params.id,
            },
          });
        } catch (error) {
          console.error("Erreur lors de l'écriture du fichier:", error);
          throw error;
        }
      });

      await Promise.all(uploadPromises);
    }

    // Récupérer l'adresse mise à jour avec les images
    const finalAdresse = await prisma.adresse.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    return NextResponse.json(finalAdresse);
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Use Next.js cookies() function for better cookie parsing
    const { cookies } = await import("next/headers");
    const token = cookies().get("token")?.value;

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
      { status: 500 },
    );
  }
}
