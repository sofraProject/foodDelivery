const express = require("express");
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est un admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

// Appliquer l'authentification et la vérification admin à toutes les routes
router.use(authenticate, isAdmin);

// Routes pour la gestion des utilisateurs
router.get("/users", adminController.getAllUsers);

// Routes pour la gestion des restaurants
router.get("/restaurants", adminController.getAllRestaurants);
router.post("/restaurants", adminController.createRestaurant);
router.put("/restaurants/:id", adminController.updateRestaurant);
router.delete("/restaurants/:id", adminController.deleteRestaurant);

// Routes pour la gestion des commandes
router.get("/orders", adminController.getAllOrders);
router.put("/orders/:id/status", adminController.updateOrderStatus);

// Routes pour la gestion des chauffeurs
router.get("/drivers", adminController.getAllDrivers);
router.post("/drivers", adminController.createDriver);
router.put("/drivers/:id", adminController.updateDriver);
router.delete("/drivers/:id", adminController.deleteDriver);

// Route pour les statistiques
router.get("/statistics", adminController.getStatistics);

module.exports = router;