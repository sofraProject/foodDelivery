const { prismaConnection } = require("../prisma/prisma");

// Crée une nouvelle localisation
exports.createLocation = async (req, res) => {
  try {
    console.log(req.body);
    const { lat, long, locationName, userId, restaurantId } = req.body;

    const location = await prismaConnection.location.create({
      data: {
        lat,
        long,
        locationName,
        userId,
        restaurantId,
      },
    });

    res.status(201).json(location);
  } catch (error) {
    console.error("Erreur lors de la création de la localisation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la localisation." });
  }
};

// Récupère toutes les localisations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await prismaConnection.location.findMany({
      include: {
        user: true,
        restaurant: true,
      },
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error("Erreur lors de la récupération des localisations:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des localisations." });
  }
};

// Récupère une localisation par son ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await prismaConnection.location.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        restaurant: true,
      },
    });

    if (!location) {
      return res.status(404).json({ message: "Localisation non trouvée." });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Erreur lors de la récupération de la localisation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la localisation." });
  }
};

// Met à jour une localisation par son ID
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, long, locationName, userId, restaurantId } = req.body;

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

    res.status(200).json(location);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la localisation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la localisation." });
  }
};

// Supprime une localisation par son ID
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaConnection.location.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erreur lors de la suppression de la localisation:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la localisation." });
  }
};

// Récupérer toutes les localisations par userId
exports.getLocationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const locations = await prismaConnection.location.findMany({
      where: { userId: parseInt(userId) },
    });

    if (locations.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune localisation trouvée pour cet utilisateur." });
    }

    res.status(200).json(locations);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des localisations par userId:",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des localisations." });
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
