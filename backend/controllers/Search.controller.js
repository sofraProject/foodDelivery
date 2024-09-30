// searchController.js

const { prismaConnection } = require("../prisma/prisma");

exports.searchProductsAndRestaurants = async (req, res) => {
  try {
    const { q } = req.query;

    // Log the query parameters
    console.log("Query parameters:", req.query);

    // Check if query parameter is provided
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required." });
    }

    // Search for restaurants
    const restaurants = await prismaConnection.user.findMany({
      where: {
        role: "restaurant_owner",
        name: {
          contains: q,  // Use `contains` for case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        imagesUrl: true,
        location: true,
      },
    });

    // Search for menu items
    const menuItems = await prismaConnection.menuItem.findMany({
      where: {
        name: {
          contains: q,  // Use `contains` for case-insensitive search
        },
      },
      include: {
        user: true, // Include the user relation
      },
    });

    // Filter menu items to only include those from restaurant owners
    const filteredMenuItems = menuItems.filter(item => item.user.role === "restaurant_owner");

    res.json({ restaurants, filteredMenuItems });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search", error: error.message });
  }
};
