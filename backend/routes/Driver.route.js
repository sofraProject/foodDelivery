// src/routes/driverRoutes.js
const express = require("express");
const { getAllDrivers, updateDriverLocation, deleteDriver } = require("../controllers/Driver.controller");

const router = express.Router();

// Route to get all drivers
router.get("/", getAllDrivers);

// Route to update driver's location
router.put("/location", updateDriverLocation);

// Route to delete a driver
router.delete("/:driverId", deleteDriver);



module.exports = router;
