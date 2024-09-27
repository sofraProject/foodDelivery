const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller");

// Create a new Order
router.post("/", OrderController.createOrder);

// Get all Orders
router.get("/", OrderController.getAllOrders);

// Get an Order by ID
router.get("/:id", OrderController.getOrderById);

// Update an Order
router.put("/:id", OrderController.updateOrder);

// Delete an Order
router.delete("/:id", OrderController.deleteOrder);

// Accept Order
router.post("/:id/accept", OrderController.acceptOrder);

// Cancel Order
router.post("/:id/cancel", OrderController.cancelOrder);

module.exports = router;
