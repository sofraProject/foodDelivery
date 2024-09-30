const express = require("express");
const router = express.Router();
const locationController = require("../controllers/Location.controller");

// Créer une nouvelle localisation
router.post("/", locationController.createLocation);

// Récupérer toutes les localisations
router.get("/", locationController.getAllLocations);

// Récupérer une localisation par ID
router.get("/:id", locationController.getLocationById);

// Mettre à jour une localisation par ID
router.put("/:id", locationController.updateLocation);

// Supprimer une localisation par ID
router.delete("/:id", locationController.deleteLocation);

// Récupérer toutes les localisations pour un utilisateur spécifique par userId
router.get("/user/:userId", locationController.getLocationsByUserId);

module.exports = router;
