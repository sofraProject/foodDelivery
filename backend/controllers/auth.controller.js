const { prismaConnection } = require("../prisma2/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const saltRounds = 10;

exports.signUp = async (req, res) => {
  console.log("signUp");
  try {
    const { email, password, role, name, location } = req.body;
    console.log(req.body);

    if (!email || !password || !role || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, role and name are required." });
    }

    const existingUser = await prismaConnection.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!["customer", "restaurant_owner", "driver"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const newUser = await prismaConnection.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
        location,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        location: newUser.location,
        photoURL: newUser.imagesUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ message: "Error creating account", error: error.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prismaConnection.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

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
    res
      .status(500)
      .json({ message: "Error signing in user", error: error.message });
  }
};

exports.me = async (req, res) => {
  const { id } = req.user; 
  try {
    
    const user = await prismaConnection.user.findUnique({ where: { id } });

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
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};
