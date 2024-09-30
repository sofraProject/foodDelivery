const { prismaConnection } = require("../prisma/prisma");

// Crée un élément de menu
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

    if (!categoryId || !userId) {
      return res
        .status(400)
        .json({ message: "Category ID and User ID are required" });
    }

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

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Récupère un élément de menu par ID
exports.getMenuItemById = async (req, res) => {
  console.log("okkkkk=", req.params);

  const {id}   = req.params;
  try {
    const menuItem = await prismaConnection.menuItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Met à jour un élément de menu
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, availble, likes, price, categoryId } =
    req.body;

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

    res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Supprime un élément de menu
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.menuItem.delete({ where: { id: parseInt(id) } });
    res.status(204).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère les éléments de menu par catégorie
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
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère tous les éléments de menu
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching all menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère tous les éléments disponibles
exports.getAllAvailableMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { availble: true },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching available menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Met à jour la disponibilité d'un élément de menu
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
      data: { availble: !menuItem.availble },
    });

    res.status(200).json({
      message: "Menu item availability updated",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Error updating menu item availability:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Récupère les éléments de menu par nom
exports.getMenuItemsByName = async (req, res) => {
  const { name } = req.params;
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { name },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère les éléments de menu par prix
exports.getMenuItemsByPrice = async (req, res) => {
  const { price } = req.params;
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { price: parseFloat(price) },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by price:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère les éléments disponibles pour un utilisateur spécifique
exports.getAvailableMenuItemsByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { userId: id, availble: true },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère les éléments non disponibles pour un utilisateur spécifique
exports.getUnavailableMenuItemsByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { userId: id, availble: false },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching unavailable menu items by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Récupère les éléments de menu par restaurant
exports.getMenuItemsByRestaurant = async (req, res) => {
  const { id } = req.params; // ID du restaurant
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { restaurantId: parseInt(id) }, // Assurez-vous que restaurantId est un champ dans votre modèle MenuItem
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
