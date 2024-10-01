const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller"); // Ensure this path is correct


// Create a new order
router.post("/", OrderController.createOrder);

// Get all orders (Admin only)
router.get("/", OrderController.getAllOrders);

// Get orders by status
router.get("/status/confirmed", OrderController.getConfirmedOrders);

// Get an order by ID
router.get("/:id", OrderController.getOrderById);

// Get orders by user ID
// router.get("/byUser/:userId", OrderController.getOrdersByUserId);

// Update an order status by ID (may include status update)
router.put("/:id", OrderController.updateOrderStatus);

// Delete an order by ID
router.delete("/:id", OrderController.deleteOrder);

// User dashboard data
router.get("/dashboard/user", OrderController.getDashboardData);

// Payment success route
router.put("/:id/success", OrderController.updateOrderPaymentSuccess);

// Payment failure route
router.put("/:id/failure", OrderController.updateOrderPaymentFailure);

// Confirm an order
router.put("/:id/confirm", OrderController.confirmOrder);

// Mark an order as ready
router.put("/:id/ready", OrderController.updateOrderToReady);

// Assign a driver to an order (without changing status)
router.put("/:id/assign-driver", OrderController.assignDriver);

module.exports = router;

