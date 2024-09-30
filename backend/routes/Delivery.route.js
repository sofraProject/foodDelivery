const express = require("express");
const { getDeliveryStatus } = require("../controllers/Delivery.controller");

const router = express.Router();

// Route to get the delivery status by order ID
router.get("/:orderId", getDeliveryStatus);

module.exports = router;
