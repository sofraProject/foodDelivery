const { prismaConnection } = require("../prisma/prisma");
const upload = require("../middleware/multer");
const bcrypt = require("bcrypt");

// Retrieve all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prismaConnection.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// Retrieve a user by ID
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

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password, balance, location, role } = req.body;
  const profilePicturePath = req.file ? req.file.path : null; // Get the path of the uploaded file

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaConnection.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        imagesUrl: profilePicturePath, // Store the profile picture path
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imagesUrl, balance, location, role } = req.body;

  if (!name && !email && !password && !imagesUrl && !balance && !location && !role) {
    return res.status(400).json({ error: "At least one field must be provided for update." });
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
    res.status(200).json({ message: "User updated successfully.", updatedUser });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found." });
    } else {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user." });
    }
  }
};

// Retrieve all restaurant owners
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

// Find nearby restaurants (logic to be implemented)
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

    // Implement your own logic for calculating distance here
    const nearbyRestaurants = await prismaConnection.user.findMany({
      where: {
        role: "RESTAURANT_OWNER",
      },
    });

    res.status(200).json(nearbyRestaurants);
  } catch (error) {
    console.error("Error finding nearby restaurants:", error);
    res.status(500).json({ error: "An error occurred while finding nearby restaurants." });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).json({ message: "User deleted successfully." });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "User not found." });
    } else {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user." });
    }
  }
};

// Update user location
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

// Retrieve all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await prismaConnection.user.findMany({
      where: { role: "CUSTOMER" }, // Ensure we fetch only customers
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers." });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await prismaConnection.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER", // Set role to CUSTOMER
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Error deleting customer." });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  const userId = parseInt(req.params.id); // Ensure user ID is an integer

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Update the user profile with the new picture path
    const updatedUser = await prismaConnection.user.update({
      where: { id: userId },
      data: {
        imageUrl: req.file.path,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).send("Error updating profile picture.");
  }
};
