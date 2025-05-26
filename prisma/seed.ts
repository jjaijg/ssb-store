import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Grains", slug: "grains" },
  { name: "Pulses", slug: "pulses" },
  { name: "Soaps", slug: "soaps" },
  { name: "Washing Liquids", slug: "washing-liquids" },
  { name: "Toothpaste", slug: "toothpaste" },
  { name: "Shampoos", slug: "shampoos" },
  { name: "Body Wash", slug: "body-wash" },
  { name: "Face Wash", slug: "face-wash" },
  { name: "Spices", slug: "spices" },
];

const createAdminUser = async () => {
  const hashedPassword = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "admin@ssb.in" },
    update: {},
    create: {
      email: "admin@ssb.in",
      name: "Admin User",
      role: "ADMIN",
      password: hashedPassword,
    },
  });
};

const createCategories = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
};

async function main() {
  // creating admin user
  await createAdminUser();
  // creating categories
  await createCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
