const express = require("express");
const userController = require("../controllers/User.controller");
const upload = require("../middleware/multer");

const router = express.Router();

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Create a new user with profile picture upload
router.post("/", upload.single("profilePicture"), userController.createUser);

// Update user by ID
router.put("/:id", userController.updateUser);

// Get all restaurants owned by users
router.get("/owner/restaurants", userController.getAllUsersRestaurant);

// Find nearby restaurants
router.post("/findNearby", userController.findNearbyRestaurants);

// Delete user by ID
router.delete("/:id", userController.deleteUser);

// Update user location
router.put("/location", userController.updateUserLocation);

// Fetch all customers
router.get("/customers/get", userController.getAllCustomers);

// Create a new customer
router.post("/customers", userController.createUser);

// Delete a customer by ID
router.delete("/customers/:id", userController.deleteCustomer);

// Update profile picture by user ID
router.put(
  "/:id/profile-picture",
  upload.single("profilePicture"),
  userController.updateProfilePicture
);

module.exports = router;
