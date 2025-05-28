import { NextResponse } from "next/server";
import { RequestService } from "@/services/requestService";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vérification des champs requis
    const requiredFields = ["nom", "tel", "type", "pays", "service"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Champs requis manquants",
          missingFields,
        },
        { status: 422 } // Unprocessable Entity
      );
    }

    // Mapping vers enum Prisma
    const adresse = {
      ...body,
    };

    const requestService = new RequestService();
    const request = await requestService.createRequest(adresse);

    return NextResponse.json(
      {
        message: "Adresse créée avec succès",
        data: request,
      },
      { status: 201 } // Created
    );
  } catch (error: any) {
    console.error("Erreur dans POST /adresse:", error);

    // Gestion des erreurs de conversion ou autres erreurs client
    if (error.message === "Pays non supporté") {
      return NextResponse.json(
        { error: "Le pays fourni n'est pas valide ou supporté." },
        { status: 400 } // Bad Request
      );
    }

    return NextResponse.json(
      {
        error: "Une erreur interne s'est produite",
        details: error.message,
      },
      { status: 500 } // Internal Server Error
    );
  }
}
