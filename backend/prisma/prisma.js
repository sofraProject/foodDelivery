// Import PrismaClient from @prisma/client and dotenv for environment variables
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
const prismaConnection = new PrismaClient();

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await prismaConnection.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

// Function to disconnect from the database
const disconnectFromDatabase = async () => {
  try {
    await prismaConnection.$disconnect();
    console.log("Disconnected from the database successfully.");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
};

// Export the Prisma connection instance and connection functions
module.exports = {
  prismaConnection,
  connectToDatabase,
  disconnectFromDatabase,
};
