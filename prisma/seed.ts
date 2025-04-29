import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
    },
  });

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Laptop",
        description: "High-performance laptop with 16GB RAM",
        price: 1299.99,
        stockCount: 10,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartphone",
        description: "Latest smartphone with 128GB storage",
        price: 799.99,
        stockCount: 20,
      },
    }),
    prisma.product.create({
      data: {
        name: "Headphones",
        description: "Noise-cancelling wireless headphones",
        price: 249.99,
        stockCount: 30,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartwatch",
        description: "Fitness tracker with heart rate monitor",
        price: 199.99,
        stockCount: 15,
      },
    }),
    prisma.product.create({
      data: {
        name: "Tablet",
        description: "10-inch tablet with retina display",
        price: 499.99,
        stockCount: 12,
      },
    }),
  ]);

  // Create carts for users
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id,
    },
  });

  // Add items to user1's cart
  await prisma.cartItem.create({
    data: {
      cartId: cart1.id,
      productId: products[0].id,
      quantity: 1,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart1.id,
      productId: products[2].id,
      quantity: 2,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
