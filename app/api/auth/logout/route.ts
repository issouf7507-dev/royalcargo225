import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Supprimer le cookie d'authentification
    cookies().delete("token");

    return NextResponse.json({ message: "Déconnexion réussie" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
