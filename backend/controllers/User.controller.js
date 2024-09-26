// userController.js

const {prismaConnection} = require("../prisma/prisma")

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prismaConnection.user.findUnique({
      where: { id: Number(id) },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, imagesUrl, balance, location, role } = req.body;
  try {
    const newUser = await prismaConnection.user.create({
      data: {
        name,
        email,
        password, // Make sure to hash the password before storing it
        imagesUrl,
        balance,
        location,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imagesUrl, balance, location, role } = req.body;
  try {
    const updatedUser = await prismaConnection.user.update({
      where: { id: Number(id) },
      data: { name, email, password, imagesUrl, balance, location, role },
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.getAllUsersRestaurant = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany({
      where: { role: "restaurant_owner" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findNearbyRestaurants = async (req, res) => {
  const { userId, radius = 1000 } = req.body;

  try {
    const user = await prismaConnection.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "customer") {
      return res.status(403).json({ error: "The user is not a customer." });
    }

    const customerLocation = user.location;
    if (!customerLocation) {
      return res.status(404).json({ error: "Customer location not found." });
    }

    // Implement your own logic to filter based on distance
    const nearbyRestaurants = await prismaConnection.user.findMany({
      where: {
        role: "restaurant_owner",
        // Implement your own logic to filter based on distance
      },
    });

    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while finding nearby restaurants." });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.updateUserLocation = async (req, res) => {
  const { id } = req.user;
  const { location } = req.body;

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
          coordinates: location,
        },
      },
    });
    res.status(200).json({ message: "User location updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
