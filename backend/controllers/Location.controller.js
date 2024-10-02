const { prismaConnection } = require("../prisma/prisma");

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { lat, long, locationName, userId, restaurantId } = req.body;
    
    // Create location in the database
    const location = await prismaConnection.location.create({
      data: {
        lat,
        long,
        locationName,
        userId,
        restaurantId,
      },
    });

    res.status(201).json(location); // Respond with the created location
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Error creating location." });
  }
};

// Retrieve all locations
exports.getAllLocations = async (req, res) => {
  try {
    // Fetch all locations with user and restaurant details
    const locations = await prismaConnection.location.findMany({
      include: {
        user: true,
        restaurant: true,
      },
    });

    res.status(200).json(locations); // Respond with the list of locations
  } catch (error) {
    console.error("Error retrieving locations:", error);
    res.status(500).json({ message: "Error retrieving locations." });
  }
};

// Retrieve a location by its ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the location by ID
    const location = await prismaConnection.location.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        restaurant: true,
      },
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    res.status(200).json(location); // Respond with the found location
  } catch (error) {
    console.error("Error retrieving location:", error);
    res.status(500).json({ message: "Error retrieving location." });
  }
};

// Update a location by its ID
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, long, locationName, userId, restaurantId } = req.body;

    // Update the location in the database
    const location = await prismaConnection.location.update({
      where: { id: parseInt(id) },
      data: {
        lat,
        long,
        locationName,
        userId,
        restaurantId,
      },
    });

    res.status(200).json(location); // Respond with the updated location
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Error updating location." });
  }
};

// Delete a location by its ID
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the location from the database
    await prismaConnection.location.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // Respond with no content status
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: "Error deleting location." });
  }
};

// Retrieve all locations by userId
exports.getLocationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch locations for the specified user
    const locations = await prismaConnection.location.findMany({
      where: { userId: parseInt(userId) },
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: "No locations found for this user." });
    }

    res.status(200).json(locations); // Respond with the user's locations
  } catch (error) {
    console.error("Error retrieving locations by userId:", error);
    res.status(500).json({ message: "Error retrieving locations." });
  }
};

// exports.getNearestRestaurant = async (req, res) => {
//   try {
//     const { lat, long } = req.query;

//     if (!lat || !long) {
//       return res
//         .status(400)
//         .json({ message: "User latitude and longitude are required." });
//     }

//     const userLat = parseFloat(lat);
//     const userLong = parseFloat(long);

//     // Fetch all restaurant locations
//     const restaurantLocations = await prismaConnection.location.findMany({
//       where: { restaurantId: { not: null } }, // Ensure we are only fetching restaurant locations
//       include: {
//         restaurant: true, // Include restaurant details
//       },
//     });

//     if (restaurantLocations.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No restaurant locations found." });
//     }

//     // Calculate the Euclidean distance for each restaurant location
//     const nearestRestaurant = restaurantLocations
//       .map((location) => {
//         const distance = Math.sqrt(
//           Math.pow(location.lat - userLat, 2) +
//             Math.pow(location.long - userLong, 2)
//         );
//         return { ...location, distance };
//       })
//       .sort((a, b) => a.distance - b.distance)[0]; // Sort by distance and get the nearest one

//     if (!nearestRestaurant) {
//       return res.status(404).json({ message: "No nearby restaurant found." });
//     }

//     res.status(200).json(nearestRestaurant);
//   } catch (error) {
//     console.error("Error retrieving nearest restaurant:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };
