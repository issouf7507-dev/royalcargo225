import { NextRequest, NextResponse } from "next/server";
import { sendSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();

    const { ok, status, data } = await sendSms(to, message);

    if (!ok) {
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur envoi SMS:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
