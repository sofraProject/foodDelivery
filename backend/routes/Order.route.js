const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller"); // Assurez-vous que ce chemin est correct

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders); // getAllOrders n'est pas défini dans votre contrôleur, assurez-vous qu'il est bien exporté
router.get("/:id", OrderController.getOrderById);
router.get("/byUser/:userId", OrderController.getOrdersByUserId);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
