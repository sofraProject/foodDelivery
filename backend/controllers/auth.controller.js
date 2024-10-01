const { PrismaClient } = require("@prisma/client");
const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const saltRounds = 10;

module.exports = {
  // Controller for user sign-up
  signUp: async (req, res) => {
    try {
      const { email, password, role, name } = req.body;
      console.log("Request body:", req.body);

      // Validate required fields
      if (!email || !password || !role || !name) {
        return res.status(400).json({ message: "Email, password, role, and name are required" });
      }

      // Check for existing user
      const existingUser = await prismaConnection.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Validate role
      if (!["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }

      // Handle profile picture upload
      const domain = process.env.DOMAIN || "http://localhost:3100/uploads/";
      const profilePicture = req.file ? `${domain}${req.file.filename}` : null;

      // Create a new user
      const newUser = await prismaConnection.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
          imagesUrl: req.file ? req.file.path : null, // Handle image upload
          imageUrl: profilePicture,
        },
      });
      console.log("User created:", newUser);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      res.status(201).json({
        message: "Account created successfully.",
        userId: newUser.id,
        token,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Error creating account.", error: error.message });
    }
  },

  // Controller for user sign-in
  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      res.status(200).json({
        message: "User signed in successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          photoURL: user.imagesUrl,
        },
      });
    } catch (error) {
      console.error("Error signing in user:", error);
      res.status(500).json({ message: "Error signing in user.", error: error.message });
    }
  },

  // Controller to fetch user information
  me: async (req, res) => {
    const { id } = req.user;

    try {
      // Find the user by ID
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          location: user.locations, // Return associated location
          photoURL: user.imageUrl,
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user.", error: error.message });
    }
  },
};
