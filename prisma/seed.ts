import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.favorites.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: { id: 1 },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
