import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

/** Identifiant de l'utilisateur connecté (cookie « token »), ou null. */
export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const decoded = await verifyToken(token);
  if (!decoded || typeof decoded === "string" || typeof decoded.userId !== "string") return null;
  return decoded.userId;
}
