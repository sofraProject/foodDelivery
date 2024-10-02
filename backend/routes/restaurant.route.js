const express = require("express");
const router = express.Router();
const RestaurantController = require("../controllers/Restaurant.controller");

// Create a new restaurant
router.post("/", RestaurantController.createRestaurant);

// Retrieve all restaurants
router.get("/", RestaurantController.getAllRestaurants);

// Retrieve a specific restaurant by ID
router.get("/:id", RestaurantController.getRestaurantById);

// Update a restaurant by ID
router.put("/:id", RestaurantController.updateRestaurant);

// Delete a restaurant by ID
router.delete("/:id", RestaurantController.deleteRestaurant);

// Retrieve the menu items of a specific restaurant by restaurant ID
router.get("/menu-items/:id", RestaurantController.getMenuItemsByRestaurant);

// Retrieve a specific restaurant by Name
router.get("/name/:restaurantName", RestaurantController.getRestaurantByName); // New Route

// Define the search route
router.get("/:restoName", RestaurantController.searchRestaurants);
module.exports = router;
