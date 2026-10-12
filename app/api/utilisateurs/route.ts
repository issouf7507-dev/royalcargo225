import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

const creation = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères").max(100),
});

/** Utilisateur connecté et toujours présent en base, sinon null. */
async function utilisateurConnecte() {
  const id = await getSessionUserId();
  if (!id) return null;
  return prisma.user.findUnique({ where: { id }, select: { id: true } });
}

/** Liste des comptes du back office (sans les mots de passe). */
export async function GET() {
  const moi = await utilisateurConnecte();
  if (!moi) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users, moi: moi.id });
}

/** Ajout d'un compte. */
export async function POST(request: Request) {
  const moi = await utilisateurConnecte();
  if (!moi) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = creation.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, 10) },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
