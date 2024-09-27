const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const saltRounds = 10;

dotenv.config();

module.exports = {
  signUp: async (req, res) => {
    try {
      const { email, password, role, name, location } = req.body;

      if (!email || !password || !role || !name) {
        return res.status(400).json({ message: "Email, password, role and name are required" });
      }

      const existingUser = await prismaConnection.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      let newUser;

      if (["customer", "restaurant_owner", "driver"].includes(role)) {
        newUser = await prismaConnection.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            name,
            location,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      // Generate the token after successful sign-up
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "Account created successfully",
        userId: newUser.id,
        token, // Include the token in the response
      });
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(500).json({ message: "Error creating account", error: error.message });
    }
  },

  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Fetch the user
      const user = await prismaConnection.user.findUnique({ where: { email } });

      // Check if user exists
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate the token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        message: "User signed in successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          photoURL: user.imagesUrl,
        },
      });
    } catch (error) {
      console.error("Error signing in user:", error);
      res.status(500).json({ message: "Error signing in user", error: error.message });
    }
  },

  me: async (req, res) => {
    const { id } = req.user;
    try {
      const user = await prismaConnection.user.findUnique({
        where: { id },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  },
};
