const { prismaConnection } = require("../prisma/prisma");

exports.createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      availble,
      likes,
      price,
      category_id,
      Users_id,
    } = req.body;

    if (!category_id || !Users_id) {
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
        category_id,
        users_id: Users_id,
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

exports.getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await prismaConnection.menuItem.findMany({
      where: { id: parseInt(id) },
      include: { user: true },
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
        category_id: categoryId,
      },
    });

    res.status(200).json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prismaConnection.menuItem.delete({ where: { id: parseInt(id) } });
    res.status(204).json({ message: "MenuItem deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.category_id;
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { category_id: parseInt(categoryId) },
      include: { user: true },
    });

    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching all menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

exports.getAllUnavailableMenuItems = async (req, res) => {
  try {
    const menuItems = await prismaConnection.menuItem.findMany({
      where: { availble: false },
    });

    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching unavailable menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.gaga = async (req, res) => {
  console.log(
    req.user,
    "id8888888888888888888888888888888888888888888888888888"
  );
  try {
    const id = req.user.id;
    const menuItems = await prismaConnection.menuItem.findMany({
      where: {
        users_id: id,
        availble: true,
      },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateMenuItemAvailble = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating menu item with id:", id);

    const menuItem = await prismaConnection.menuItem.findMany({
      where: { id: parseInt(id) },
    });

    if (!menuItem) {
      console.log("Menu item not found");
      return res.status(404).json({ message: "Menu item not found" });
    }

    const updatedMenuItem = await prismaConnection.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        availble: !menuItem.availble,
      },
    });

    console.log("Updated menu item:", updatedMenuItem);

    res.status(200).json({
      message: "Menu item availability updated",
      menuItem: updatedMenuItem,
      newAvailability: updatedMenuItem.availble,
    });
  } catch (error) {
    console.error("Error updating menu item availability:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.gagafalse = async (req, res) => {
  console.log(
    req.user,
    "id8888888888888888888888888888888888888888888888888888"
  );
  try {
    const id = req.user.id;
    const menuItems = await prismaConnection.menuItem.findMany({
      where: {
        users_id: id,
        availble: false,
      },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
