const express = require("express");
const authenticate = require("../middleware/authMiddleware.js");
const router = express.Router();

const paymentController = require("../controllers/Payment.controller.js");
router.post(
  "/generatePayment",
  authenticate,
  paymentController.generatePayment
);
module.exports = router;
