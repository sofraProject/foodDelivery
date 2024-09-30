// src/routes/driverRoutes.js
const express = require("express");
const { updateDriverLocation } = require("../controllers/Driver.controller");

const router = express.Router();

// Route to update driver's location
router.post("/location", updateDriverLocation);

module.exports = router;
