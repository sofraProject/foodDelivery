const express = require("express");
const userController = require("../controllers/User.controller");
const upload = require("../middleware/multer")

const router = express.Router();
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", upload.single("profilePicture"), userController.createUser); 
router.put("/:id", userController.updateUser);
router.get("/owner/restaurants", userController.getAllUsersRestaurant);
router.post("/findNearby", userController.findNearbyRestaurants);
router.delete("/:id", userController.deleteUser);
router.put("/location", userController.updateUserLocation);
// Fetch all customers
router.get("/customers/get", userController.getAllCustomers); 

// Create a new customer
router.post("/customers", userController.createUser);

// Delete a customer by ID
router.delete("/customers/:id", userController.deleteCustomer);


// Fetch all customers
router.get("/customers/get", userController.getAllCustomers); 

// Create a new customer
router.post("/customers", userController.createUser);

// Delete a customer by ID
router.delete("/customers/:id", userController.deleteCustomer);

// New route for updating profile picture
router.put("/:id/profile-picture", upload.single('profilePicture'), userController.updateProfilePicture);

module.exports = router;
