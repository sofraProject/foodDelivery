const { prismaConnection } = require("../prisma/prisma");

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      availble,
      likes,
      price,
      categoryId,
      userId,
    } = req.body;

    // Validate required fields
    if (!categoryId || !userId) {
      return res.status(400).json({ message: "Category ID and User ID are required" });
    }

    // Create the menu item in the database
    const menuItem = await prismaConnection.menuItem.create({
      data: {
        name,
        description,
        imageUrl,
        availble,
        likes,
        price,
        categoryId,
        userId,
      },
    });

    res.status(201).json(menuItem); // Respond with the created menu item
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Retrieve a menu item by ID
exports.getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await prismaConnection.menuItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem); // Respond with the found menu item
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, availble, likes, price, categoryId } = req.body;

  try {
    const menuItem = await prismaConnection.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        imageUrl,
        availble,
        likes,
        price,
        categoryId,
      },
    });

    res.status(200).json(menuItem); // Respond with the updated menu item
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.menuItem.delete({ where: { id: parseInt(id) } });
    res.status(204).json({ message: "Menu item deleted successfully" }); // Respond with no content status
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.category_id, 10);
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { categoryId },
      include: {
        category: true,   // Including the category details
        restaurant: true, // Including the restaurant details
        orderItems: true, // Including related order items
      },
    });
    res.status(200).json(menuItems); // Respond with the list of menu items
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany();
    res.status(200).json(menuItems); // Respond with the list of all menu items
  } catch (error) {
    console.error("Error fetching all menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve all available menu items
exports.getAllAvailableMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { availble: true },
    });
    res.status(200).json(menuItems); // Respond with the list of available menu items
  } catch (error) {
    console.error("Error fetching available menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update the availability of a menu item
exports.updateMenuItemAvailble = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await prismaConnection.menuItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const updatedMenuItem = await prismaConnection.menuItem.update({
      where: { id: parseInt(id) },
      data: { availble: !menuItem.availble }, // Toggle availability
    });

    res.status(200).json({
      message: "Menu item availability updated",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Error updating menu item availability:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Retrieve menu items by name
exports.getMenuItemsByName = async (req, res) => {
  const { name } = req.params;
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { name },
    });
    res.status(200).json(menuItems); // Respond with the list of menu items by name
  } catch (error) {
    console.error("Error fetching menu items by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve menu items by price
exports.getMenuItemsByPrice = async (req, res) => {
  const { price } = req.params;
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { price: parseFloat(price) },
    });
    res.status(200).json(menuItems); // Respond with the list of menu items by price
  } catch (error) {
    console.error("Error fetching menu items by price:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve available menu items for a specific user
exports.getAvailableMenuItemsByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { userId: id, availble: true },
    });
    res.status(200).json(menuItems); // Respond with available menu items for the user
  } catch (error) {
    console.error("Error fetching menu items by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve unavailable menu items for a specific user
exports.getUnavailableMenuItemsByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { userId: id, availble: false },
    });
    res.status(200).json(menuItems); // Respond with unavailable menu items for the user
  } catch (error) {
    console.error("Error fetching unavailable menu items by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve menu items by restaurant
exports.getMenuItemsByRestaurant = async (req, res) => {
  const { id } = req.params; // Ensure this ID is being correctly captured

  // Validate that the ID is a number
  const restaurantId = parseInt(id);
  if (isNaN(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurant ID." });
  }

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { restaurantId: restaurantId }, // Use the parsed ID
      include: {
        category: true, // Include the category for each menu item
        restaurant: true, // Include the restaurant for each menu item
      },
    });

    if (!menuItems.length) {
      return res.status(404).json({ message: "No menu items found for this restaurant." });
    }

    res.status(200).json(menuItems); // Respond with the list of menu items for the restaurant
  } catch (error) {
    console.error("Error fetching menu items for restaurant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
