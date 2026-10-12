/**
 * Comptes de test du back office (base locale uniquement).
 * Lancement : npm run seed:test-users
 * Relancer le script remet les mots de passe ci-dessous ; les autres comptes ne sont pas touchés.
 */
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const TEST_USERS = [
  { email: "admin.test@royalcargo225.local", password: "RcAdmin-test-2026" },
  { email: "agent.test@royalcargo225.local", password: "RcAgent-test-2026" },
];

async function main() {
  const host = process.env.DATABASE_HOST;
  if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1"].includes(host ?? "")) {
    throw new Error(`Refusé : la base (${host}) n'est pas locale.`);
  }

  for (const { email, password } of TEST_USERS) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email },
      update: { password: hashed },
      create: { email, password: hashed },
    });
    console.log(`✓ ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
