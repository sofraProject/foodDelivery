const express = require("express");
const router = express.Router();
const RestaurantController = require("../controllers/restaurant.controller");

router.post("/nearest-restaurants", RestaurantController.getNearestRestaurants);

module.exports = router;
