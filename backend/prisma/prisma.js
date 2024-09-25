// Import PrismaClient from @prisma/client and dotenv for environment variables
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

//* Initialize Prisma Client with the constructed DATABASE_URL
const prismaConnection = new PrismaClient();

//* Export the Prisma connection instance
module.exports = prismaConnection;
