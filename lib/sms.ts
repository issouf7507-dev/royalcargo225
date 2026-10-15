/** Envoi d'un SMS via Sayelesend. Renvoie le statut HTTP et la réponse du fournisseur. */
export async function sendSms(to: string, message: string) {
  // Tests en local : SMS_DRY_RUN=true affiche le SMS dans la console sans l'envoyer
  if (process.env.SMS_DRY_RUN === "true") {
    console.log(`[SMS simulé] → ${to}\n${message}`);
    return { ok: true, status: 200, data: { simulated: true } };
  }

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

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

/** Numéro au format international, comme pour les SMS de changement de statut. */
export const toInternational = (tel: string) => `+225${tel.replace(/\s+/g, "")}`;
