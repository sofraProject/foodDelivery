const express = require("express");
const router = express.Router();
const DeliveryController = require("../controllers/Delivery.controller");

router.post("/", DeliveryController.createDelivery);
router.get("/", DeliveryController.getAllDeliveries);
router.get("/:id", DeliveryController.getDeliveryById);
router.put("/:id", DeliveryController.updateDelivery);
router.delete("/:id", DeliveryController.deleteDelivery);

module.exports = router;
