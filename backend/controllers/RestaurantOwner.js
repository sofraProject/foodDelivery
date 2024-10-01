// Search for a restaurant by name
exports.searchRestaurantByName = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required." });
    }

    // Query to find restaurants whose names contain the search term
    const restaurants = await prismaConnection.restaurant.findMany({
      where: {
        name: {
          contains: searchTerm, // Case-insensitive partial match
          mode: "insensitive",
        },
      },
    });

    if (restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error searching for restaurant:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
