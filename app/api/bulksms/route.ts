import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();

    // Sans "www" : la redirection 301 de www.sayelesend.com transforme le POST en GET
    // et fait perdre le body et l'en-tête Authorization.
    const response = await fetch("https://sayelesend.com/api/v1/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SAYELESEND_API_KEY}`,
      },
      body: JSON.stringify({ to, message, channel: "sms" }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
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
