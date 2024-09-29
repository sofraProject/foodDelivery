const { prismaConnection } = require("../prisma/prisma");

// Create a restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, ownerId, imageUrl } = req.body;

    if (!name || !ownerId) {
      return res
        .status(400)
        .json({ message: "Name and owner ID are required" });
    }

    const restaurant = await prismaConnection.restaurant.create({
      data: {
        name,
        description,
        ownerId, // Make sure ownerId corresponds to the user who owns the restaurant
        imageUrl,
      },
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Retrieve all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prismaConnection.restaurant.findMany({
      include: {
        owner: true, // Include restaurant owner information
      },
    });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve a restaurant by ID
exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await prismaConnection.restaurant.findUnique({
      where: { id: parseInt(id) },
      include: {
        owner: true, // Include owner information
        menuItems: true, // Include related menu items
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, ownerId } = req.body;

  try {
    const restaurant = await prismaConnection.restaurant.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        imageUrl,
        ownerId,
      },
    });

    res
      .status(200)
      .json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Restaurant not found" });
    } else {
      console.error("Error updating restaurant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    await prismaConnection.restaurant.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Restaurant not found" });
    } else {
      console.error("Error deleting restaurant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Retrieve the menu items for a specific restaurant
exports.getMenuItemsByRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { restaurantId: parseInt(id) },
      include: {
        category: true, // Include the category for each menu item
      },
    });

    if (!menuItems.length) {
      return res
        .status(404)
        .json({ message: "No menu items found for this restaurant" });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items for restaurant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve a restaurant by its name
exports.getRestaurantByName = async (req, res) => {
  const { restaurantName } = req.params;

  try {
    const restaurant = await prismaConnection.restaurant.findFirst({
      where: {
        name: restaurantName,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant by name:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
