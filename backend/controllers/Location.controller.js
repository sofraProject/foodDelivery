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
