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

    exports.getNearestRestaurants = async (req, res) => {
      const { userLat, userLng, maxDistance } = req.query; // Get user location and distance

      try {
        const restaurants = await prismaConnection.$queryRaw`
          SELECT *, 
            (6371 * acos(cos(radians(${userLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLng})) 
            + sin(radians(${userLat})) * sin(radians(latitude)))) AS distance 
          FROM restaurants 
          HAVING distance < ${maxDistance} 
          ORDER BY distance 
          LIMIT 0 , 20;
        `; // Haversine formula to calculate distance

        res.status(200).json(restaurants);
      } catch (error) {
        console.error("Error fetching nearest restaurants:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };

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
  const { id } = req.params; // Extract id from request parameters
  console.log("ID received:", id); // Log the received ID for debugging

  if (!id) {
    return res.status(400).json({ message: "Restaurant ID is required." });
  }

  try {
    const restaurant = await prismaConnection.restaurant.findUnique({
      where: { id: parseInt(id) }, // Ensure the ID is converted to an integer
      include: {
        owner: true,
        menuItems: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
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

// Retrieve all restaurants with menu items and their categories
exports.getAllRestaurantswithCat = async (req, res) => {
  try {
    const restaurants = await prismaConnection.restaurant.findMany({
      include: {
        menuItems: {
          include: {
            category: true, // Include the category for each menu item
          },
        },
      },
    });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
;


// In Restaurant.controller.js
exports.getCategoriesByRestaurantId = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await prismaConnection.category.findMany({
      where: { restaurantId: Number(id) },
      include: { menuItems: true }, // Ensure this includes the items
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve a restaurant by owner ID
exports.getRestaurantByOwnerId = async (req, res) => {
  const { ownerId } = req.params;
  console.log("Owner ID received:", ownerId); // Log the ownerId

  try {
    // Convert ownerId to an integer
    const ownerIdInt = parseInt(ownerId, 10);
    if (isNaN(ownerIdInt)) {
      return res.status(400).json({ message: "Invalid owner ID." });
    }

    // Find all restaurants by ownerId
    const restaurants = await prismaConnection.restaurant.findMany({
      where: {
        ownerId: ownerIdInt,
      },
      include: {
        owner: true,
        menuItems: true,
      },
    });

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants by owner ID:", error);
    return res.status(500).json({ message: "Error fetching restaurants." });
  }
};

