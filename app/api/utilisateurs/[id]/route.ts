import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

const reinitialisation = z.object({
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères").max(100),
});

async function utilisateurConnecte() {
  const id = await getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id }, select: { id: true } });
}

/** Réinitialisation du mot de passe d'un autre compte. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moi = await utilisateurConnecte();
  if (!moi) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = reinitialisation.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  const cible = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!cible) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  await prisma.user.update({ where: { id }, data: { password: await bcrypt.hash(parsed.data.password, 10) } });
  return NextResponse.json({ message: "Mot de passe réinitialisé" });
}

/** Suppression d'un compte (ni le sien, ni le dernier). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const moi = await utilisateurConnecte();
  if (!moi) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (id === moi.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
  }
  const cible = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!cible) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if ((await prisma.user.count()) <= 1) {
    return NextResponse.json({ error: "Impossible de supprimer le dernier compte" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: "Utilisateur supprimé" });
}
