const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/Restaurant.controller");

// Create a new restaurant
router.post("/", restaurantController.createRestaurant);

// Retrieve all restaurants with catorgies
router.get("/category", restaurantController.getAllRestaurantswithCat);

// Retrieve all restaurants
router.get("/", restaurantController.getAllRestaurants);

// Retrieve a specific restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Update a restaurant by ID
router.put("/:id", restaurantController.updateRestaurant);

// Delete a restaurant by ID
router.delete("/:id", restaurantController.deleteRestaurant);

// Retrieve the menu items of a specific restaurant by restaurant ID
router.get("/menu-items/:id", restaurantController.getMenuItemsByRestaurant);

// Retrieve a specific restaurant by Name
router.get("/name/:restaurantName", restaurantController.getRestaurantByName); // New Route

// Retrieve a restaurant by owner ID
router.get("/owner/:ownerId", restaurantController.getRestaurantByOwnerId); // New Route

router.get("/:id/categories", restaurantController.getCategoriesByRestaurantId);


module.exports = router;
