const express = require("express");
const menuItemController = require("../controllers/MenuItem.controller");
const router = express.Router();

// Créer un élément de menu
router.post("/", menuItemController.createMenuItem);

// Récupérer tous les éléments de menu
router.get("/", menuItemController.getAllMenuItems);

// Récupérer un élément de menu par ID
router.get("/:id", menuItemController.getMenuItemById);

// Récupérer les éléments de menu disponibles
router.get("/available", menuItemController.getAllAvailableMenuItems);

// Récupérer les éléments de menu par catégorie
router.get("/category/:category_id", menuItemController.getMenuItemsByCategory);

// Récupérer les éléments de menu par nom
router.get("/name/:name", menuItemController.getMenuItemsByName);

// Récupérer les éléments de menu par prix
router.get("/price/:price", menuItemController.getMenuItemsByPrice);

// Récupérer les éléments de menu disponibles pour un utilisateur spécifique
router.get("/user/available", menuItemController.getAvailableMenuItemsByUser);

// Récupérer les éléments de menu non disponibles pour un utilisateur spécifique
router.get(
  "/user/unavailable",
  menuItemController.getUnavailableMenuItemsByUser
);

// Mettre à jour un élément de menu
router.put("/:id", menuItemController.updateMenuItem);

// Mettre à jour la disponibilité d'un élément de menu
router.patch("/:id/availability", menuItemController.updateMenuItemAvailble);

// Supprimer un élément de menu
router.delete("/:id", menuItemController.deleteMenuItem);

// Récupérer les éléments de menu d'un restaurant spécifique
router.get("/restaurant/:id", menuItemController.getMenuItemsByRestaurant);

module.exports = router;
