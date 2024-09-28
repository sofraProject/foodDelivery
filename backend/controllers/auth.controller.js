const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env

const saltRounds = 10;

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, role, name, location } = req.body;

      if (!email || !password || !role || !name) {
        return res.status(400).json({
          message: "Email, password, role, and name are required.",
        });
      }

      const existingUser = await prismaConnection.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (!["customer", "restaurant_owner", "driver"].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }

      const domain = process.env.DOMAIN || "http://localhost:3100/uploads/";
      const profilePicture = req.file ? `${domain}${req.file.filename}` : null;

      const newUser = await prismaConnection.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          name,
          imagesUrl: profilePicture,
          location,
        },
      });

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
      res
        .status(500)
        .json({ message: "Error creating account.", error: error.message });
    }
  },

  signIn: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Validate user credentials
      const user = await prismaConnection.user.findUnique({
        where: { email },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Default to 1h if not specified
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error("Error signing in user:", error);
      res.status(500).json({ error: "Error signing in user." });
    }
  },

  me: async (req, res) => {
    const { id } = req.user;

    try {
      const user = await prismaConnection.user.findUnique({
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
          location: user.location,
          name: user.name,
          photoURL: user.imagesUrl,
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
