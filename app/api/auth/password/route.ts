import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";

const schema = z.object({
  actuel: z.string().min(1, "Mot de passe actuel requis"),
  nouveau: z.string().min(8, "Le nouveau mot de passe doit faire au moins 8 caractères").max(100),
});

/** Changement de son propre mot de passe (le mot de passe actuel est vérifié). */
export async function PATCH(request: Request) {
  const id = await getSessionUserId();
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide" }, { status: 400 });
  }

  if (!(await bcrypt.compare(parsed.data.actuel, user.password))) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(parsed.data.nouveau, 10) } });
  return NextResponse.json({ message: "Mot de passe modifié" });
}
