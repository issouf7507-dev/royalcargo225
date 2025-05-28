import { RequestService } from "@/services/requestService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { codeTracking } = body;

    if (!codeTracking) {
      return NextResponse.json(
        { error: "Champs requis manquants : codeTracking" },
        { status: 422 } // Unprocessable Entity
      );
    }

    const requestService = new RequestService();
    const request = await requestService.getRequestByCode(codeTracking);

    if (!request) {
      return NextResponse.json(
        { error: "Demande non trouvée pour ce code de suivi." },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json({ status: 200, request }); // OK
  } catch (err) {
    console.error("Erreur serveur :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 } // Internal Server Error
    );
  }
}
