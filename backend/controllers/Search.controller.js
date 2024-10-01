// searchController.js

const { prismaConnection } = require("../prisma/prisma");

// Search for products and restaurants based on the query parameter
exports.searchProductsAndRestaurants = async (req, res) => {
  try {
    const { q } = req.query;

    // Log the query parameters for debugging
    console.log("Query parameters:", req.query);

    // Check if the query parameter 'q' is provided
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required." });
    }

    // Search for restaurants by owner name
    const restaurants = await prismaConnection.user.findMany({
      where: {
        role: "restaurant_owner",
        name: {
          contains: q,  // Case-insensitive search
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

    // Search for menu items by name
    const menuItems = await prismaConnection.menuItem.findMany({
      where: {
        name: {
          contains: q,  // Case-insensitive search
        },
      },
      include: {
        user: true, // Include the user relation
      },
    });

    // Filter menu items to include only those from restaurant owners
    const filteredMenuItems = menuItems.filter(item => item.user.role === "restaurant_owner");

    // Respond with the search results
    res.json({ restaurants, filteredMenuItems });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search", error: error.message });
  }
};
