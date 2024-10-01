const express = require('express');
const router = express.Router();
const {
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../controllers/orderitem.controller'); // Adjust the path as necessary

// Routes
router.get('/order-items/order/:orderId', getOrderItemsByOrderId);
router.post('/order-items', createOrderItem);
router.put('/order-items/:orderItemId', updateOrderItem);
router.delete('/order-items/:orderItemId', deleteOrderItem);

module.exports = router;
