import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

/** Compte connecté (affiché dans la barre latérale du back office). */
export async function GET() {
  const id = await getSessionUserId();
  const user = id ? await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } }) : null;
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(user);
}
