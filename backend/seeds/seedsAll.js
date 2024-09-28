// Import PrismaClient and dotenv for environment variables
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Universal seeder function
const seedEntities = async (entityName, data) => {
  try {
    await prisma[entityName].createMany({ data });
    console.log(`${entityName} inserted successfully.`);
  } catch (error) {
    console.error(`Error inserting ${entityName}:`, error);
  }
};

const password = "123456789";
const hashedPassword = bcrypt.hashSync(password, 10);

// Seeder for User, Restaurant, and related models
const runSeeder = async () => {
  // Connect to database
  await prisma.$connect();

  // Seed Users
  await seedEntities("user", [
    {
      name: "Test Customer",
      email: "customer@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
    {
      name: "Test Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
    {
      name: "Test Driver",
      email: "driver@example.com",
      password: hashedPassword,
      role: "DRIVER",
    },
    {
      name: "Test Restaurant Owner",
      email: "owner@example.com",
      password: hashedPassword,
      role: "RESTAURANT_OWNER",
    },
  ]);

  // Seed Restaurants
  await seedEntities("restaurant", [
    {
      name: "Pizza Palace",
      description: "Delicious pizzas served daily",
      ownerId: 4, // Linked to Test Restaurant Owner
    },
  ]);

  // Seed Categories
  await seedEntities("category", [
    { name: "Pizza", restaurantId: 1 },
    { name: "Burgers", restaurantId: 1 },
  ]);

  // Seed MenuItems
  await seedEntities("menuItem", [
    {
      name: "Margherita Pizza",
      price: 12.5,
      categoryId: 1, // Linked to Pizza category
      restaurantId: 1, // Linked to Pizza Palace
    },
    {
      name: "Cheeseburger",
      price: 10.0,
      categoryId: 2, // Linked to Burgers category
      restaurantId: 1, // Linked to Pizza Palace
    },
  ]);

  // Seed Orders
  await seedEntities("order", [
    {
      customerId: 1, // Test Customer
      restaurantId: 1, // Pizza Palace
      status: "PENDING",
      totalPrice: 22.5,
    },
  ]);

  // Seed OrderItems
  await seedEntities("orderItem", [
    {
      orderId: 1, // Linked to the first order
      menuItemId: 1, // Margherita Pizza
      quantity: 2,
      price: 12.5,
    },
    {
      orderId: 1, // Linked to the first order
      menuItemId: 2, // Cheeseburger
      quantity: 1,
      price: 10.0,
    },
  ]);

  // Disconnect from database
  await prisma.$disconnect();
};

// Run the seed function
runSeeder().catch((error) => {
  console.error("Error running seeder:", error);
  prisma.$disconnect();
});
