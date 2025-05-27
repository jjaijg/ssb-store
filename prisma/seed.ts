import { PrismaClient } from "@prisma/client";
import { DiscountType, Status } from "@prisma/client";
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

const createProducts = async () => {
  // This function can be implemented to create products if needed

  // First, create categories
  const groceryCategory = await prisma.category.create({
    data: {
      name: "Grocery",
      slug: "grocery",
      description: "Daily essential grocery items",
    },
  });

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Aashirvaad",
        slug: "aashirvaad",
        description: "Quality wheat products from ITC",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Tata",
        slug: "tata",
        description: "Trusted consumer products",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Aachi",
        slug: "aachi",
        description: "Traditional Indian spices",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Sakthi",
        slug: "sakthi",
        description: "Authentic masalas and spices",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Comfort",
        slug: "comfort",
        description: "Fabric care products",
      },
    }),
  ]);

  // Create products with variants
  // Import DiscountType enum from Prisma client

  const products = [
    {
      name: "Aashirvaad Whole Wheat Atta",
      slug: "aashirvaad-whole-wheat-atta",
      description:
        "100% pure whole wheat flour, perfect for rotis and chapatis",
      brandId: brands[0].id,
      categoryId: groceryCategory.id,
      status: "ACTIVE" as Status,
      variants: [
        {
          variantName: "Small Pack",
          unit: "kg",
          value: 1,
          price: 55.0,
          sku: "ASH-WW-1KG",
          stock: 100,
          minOrderQty: 1,
          maxOrderQty: 5,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
        {
          variantName: "Medium Pack",
          unit: "kg",
          value: 5,
          price: 250.0,
          sku: "ASH-WW-5KG",
          stock: 50,
          minOrderQty: 1,
          maxOrderQty: 3,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
      ],
    },
    {
      name: "Tata Salt",
      slug: "tata-salt",
      description: "Iodised salt for daily cooking needs",
      brandId: brands[1].id,
      categoryId: groceryCategory.id,
      status: "ACTIVE" as Status,
      variants: [
        {
          variantName: "Regular Pack",
          unit: "kg",
          value: 1,
          price: 24.0,
          sku: "TATA-SALT-1KG",
          stock: 200,
          minOrderQty: 1,
          maxOrderQty: 5,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
      ],
    },
    {
      name: "Aachi Garam Masala",
      slug: "aachi-garam-masala",
      description: "Authentic blend of aromatic Indian spices",
      brandId: brands[2].id,
      categoryId: groceryCategory.id,
      status: "ACTIVE" as Status,
      variants: [
        {
          variantName: "Small Pack",
          unit: "g",
          value: 50,
          price: 35.0,
          sku: "AACHI-GM-50G",
          stock: 100,
          minOrderQty: 1,
          maxOrderQty: 10,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
        {
          variantName: "Large Pack",
          unit: "g",
          value: 100,
          price: 65.0,
          sku: "AACHI-GM-100G",
          stock: 50,
          minOrderQty: 1,
          maxOrderQty: 5,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
      ],
    },
    {
      name: "Sakthi Biryani Masala",
      slug: "sakthi-biryani-masala",
      description: "Perfect blend of spices for authentic biryani",
      brandId: brands[3].id,
      categoryId: groceryCategory.id,
      status: "ACTIVE" as Status,
      variants: [
        {
          variantName: "Regular Pack",
          unit: "g",
          value: 50,
          price: 45.0,
          sku: "SAKTHI-BM-50G",
          stock: 75,
          minOrderQty: 1,
          maxOrderQty: 10,
          discountType: "PERCENTAGE" as DiscountType,
          discountValue: 10,
        },
      ],
    },
    {
      name: "Comfort Fabric Conditioner",
      slug: "comfort-fabric-conditioner",
      description: "Superior fabric care with long-lasting fragrance",
      brandId: brands[4].id,
      categoryId: groceryCategory.id,
      status: "ACTIVE" as Status,
      variants: [
        {
          variantName: "Small Bottle",
          unit: "ml",
          value: 200,
          price: 99.0,
          sku: "COMFORT-FC-200ML",
          stock: 50,
          minOrderQty: 1,
          maxOrderQty: 5,
          discountType: DiscountType.NONE,
          discountValue: null,
        },
        {
          variantName: "Large Bottle",
          unit: "ml",
          value: 860,
          price: 375.0,
          sku: "COMFORT-FC-860ML",
          stock: 30,
          minOrderQty: 1,
          maxOrderQty: 3,
          discountType: "FIXED" as DiscountType,
          discountValue: 25,
        },
      ],
    },
  ];

  // Create products and their variants
  for (const product of products) {
    const { variants, ...productData } = product;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants,
        },
      },
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log("Products created successfully");
};

async function main() {
  console.log("Starting database seeding...");
  // creating admin user
  await createAdminUser();
  // creating categories
  await createCategories();
  // creating products
  await createProducts();
  console.log("Database seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
