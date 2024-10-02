const express = require("express");
const router = express.Router();
// Import controllers for order item management
const {
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require("../controllers/orderitem.controller");

// Routes for order item management
router.get("/order-items/order/:orderId", getOrderItemsByOrderId); // Get order items by order ID
router.post("/order-items", createOrderItem); // Create a new order item
router.put("/order-items/:orderItemId", updateOrderItem); // Update an order item by ID
router.delete("/order-items/:orderItemId", deleteOrderItem); // Delete an order item by ID

module.exports = router;
