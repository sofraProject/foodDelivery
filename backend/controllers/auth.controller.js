const { PrismaClient } = require("@prisma/client");
const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();
const saltRounds = 10;

module.exports = {
  // Contrôleur pour l'inscription d'un utilisateur
  signUp: async (req, res) => {
    try {
      const { email, password, role, name } = req.body;
      console.log("Request body:", req.body);
      // Validation des champs requis
      if (!email || !password || !role || !name) {
        return res
          .status(400)
          .json({ message: "Email, password, role, and name are required" });
      }

      // Check for existing user
      const existingUser = await prismaConnection.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Validation du rôle
      if (!["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }

      const domain = process.env.DOMAIN || "http://localhost:3100/uploads/";
      const profilePicture = req.file ? `${domain}${req.file.filename}` : null;

      // Création d'un nouvel utilisateur
      const newUser = await prismaConnection.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
          // locations: {
          //   create: {
          //     lat: location.lat,
          //     long: location.lng,
          //     locationName: location.name,
          //   },
          // }, // Gère la relation avec l'entité Location
          // imagesUrl: req.file ? req.file.path : null, // Add image upload handling
          imageUrl: profilePicture,
        },
      });
      console.log("User created:", newUser);

      // Génération du token JWT
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      res.status(201).json({
        message: "Account created successfully.",
        userId: newUser.id,
        token,
        token,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      res
        .status(500)
        .json({ message: "Error creating account.", error: error.message });
    }
  },

  // Contrôleur pour la connexion de l'utilisateur
  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Recherche de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Génération du token JWT
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
      res
        .status(500)
        .json({ message: "Error signing in user.", error: error.message });
    }
  },

  // Contrôleur pour récupérer les informations de l'utilisateur
  me: async (req, res) => {
    const { id } = req.user;

    try {
      // Recherche de l'utilisateur par ID
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          location: user.locations, // Renvoie la localisation associée
          photoURL: user.imageUrl,
        },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res
        .status(500)
        .json({ message: "Error fetching user.", error: error.message });
    }
  },
};
