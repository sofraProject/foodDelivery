const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// Récupère tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// Récupère un utilisateur par son ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prismaConnection.user.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

// Crée un nouvel utilisateur
exports.createUser = async (req, res) => {
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaConnection.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        imagesUrl,
        balance,
        location,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};

// Met à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;

  if (
    !name &&
    !email &&
    !password &&
    !imagesUrl &&
    !balance &&
    !location &&
    !role
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update." });
  }

  try {
    const updatedData = { name, email, imagesUrl, balance, location, role };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prismaConnection.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    res
      .status(200)
      .json({ message: "User updated successfully.", updatedUser });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found." });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user." });
    }
  }
};

// Récupère tous les propriétaires de restaurant
exports.getAllUsersRestaurant = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany({
      where: { role: "RESTAURANT_OWNER" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching restaurant owners:", error);
    res.status(500).json({ error: "Failed to fetch restaurant owners." });
  }
};

// Recherche les restaurants à proximité (logiciel à implémenter)
exports.findNearbyRestaurants = async (req, res) => {
  const { userId, radius = 1000 } = req.body;

  try {
    const user = await prismaConnection.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "CUSTOMER") {
      return res.status(403).json({ error: "The user is not a customer." });
    }

    const customerLocation = user.location;
    if (!customerLocation) {
      return res.status(404).json({ error: "Customer location not found." });
    }

    // Implémentez votre propre logique de calcul de distance ici
    const nearbyRestaurants = await prismaConnection.user.findMany({
      where: {
        role: "RESTAURANT_OWNER",
      },
    });

    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    console.error("Error finding nearby restaurants:", error);
    res
      .status(500)
      .json({ error: "An error occurred while finding nearby restaurants." });
  }
};

// Supprime un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found." });
    } else {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user." });
    }
  }
};

// Met à jour la localisation de l'utilisateur
exports.updateUserLocation = async (req, res) => {
  const { id } = req.user;
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: "Location is required." });
  }

  try {
    const user = await prismaConnection.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await prismaConnection.user.update({
      where: { id },
      data: {
        location: {
          type: "Point",
          coordinates: location, // Assurez-vous que cela correspond à votre structure de données de localisation
        },
      },
    });
    res.status(200).json({ message: "User location updated successfully." });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ error: "Failed to update user location." });
  }
};
