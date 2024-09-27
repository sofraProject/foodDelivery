const express = require("express");
const router = express.Router();
const cartController = require("../controllers/carts.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", cartController.getAllCarts);
router.get("/withid", authMiddleware, cartController.getCartById);
router.post("/", authMiddleware, cartController.createCart);
router.put("/update/:id", authMiddleware, cartController.updateCart);
router.delete("/delete/:id", authMiddleware, cartController.deleteCart);
router.get("/customer/:customerId", cartController.getCartByCustomerId);
router.get("/menuitem/:menuItemId", cartController.getCartByMenuItemId);
router.get("/restaurantowner/:restaurantOwnerId", cartController.getCartByRestaurantOwnerId);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;