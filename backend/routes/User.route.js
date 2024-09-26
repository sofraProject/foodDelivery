// userRoutes.js

const express = require("express");
const userController = require("../controllers/User.controller");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.get("/restaurants", userController.getAllUsersRestaurant);
router.post("/findNearby", userController.findNearbyRestaurants);
router.delete("/:id", userController.deleteUser);
router.put("/location", userController.updateUserLocation);

module.exports = router;
