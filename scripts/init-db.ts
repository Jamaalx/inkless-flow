import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@inklessflow.com" },
    update: {},
    create: {
      email: "demo@inklessflow.com",
      name: "Demo User",
      hashedPassword: await hash("demopassword", 10),
    },
  });

  console.log("Database initialized with demo user:", demoUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
