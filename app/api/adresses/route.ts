import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Utiliser cookies() de Next.js pour une extraction plus robuste
    const { cookies } = await import("next/headers");
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const adresses = await prisma.adresse.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(adresses);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
