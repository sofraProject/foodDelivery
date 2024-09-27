const { prismaConnection } = require("../prisma/prisma");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
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
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    // Hash the password before storing
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

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imagesUrl, balance, location, role } =
    req.body;

  // Validate required fields
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

    // Hash the password if it's being updated
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

exports.getAllUsersRestaurant = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany({
      where: { role: "restaurant_owner" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching restaurant owners:", error);
    res.status(500).json({ error: "Failed to fetch restaurant owners." });
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
        // You will need to implement your own logic to filter based on distance here
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
          coordinates: location, // Ensure this matches your location data structure
        },
      },
    });
    res.status(200).json({ message: "User location updated successfully." });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ error: "Failed to update user location." });
  }
};
