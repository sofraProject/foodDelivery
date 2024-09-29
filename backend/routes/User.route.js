// userRoutes.js

const express = require("express");
const userController = require("../controllers/User.controller");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.get("/owner/restaurants", userController.getAllUsersRestaurant);
router.post("/findNearby", userController.findNearbyRestaurants);
router.delete("/:id", userController.deleteUser);
router.put("/location", userController.updateUserLocation);
// Fetch all customers
router.get("/customers", customerController.getAllCustomers);

// Create a new customer
router.post("/customers", customerController.createUser);

// Delete a customer by ID
router.delete("/customers/:id", customerController.deleteCustomer);


module.exports = router;
