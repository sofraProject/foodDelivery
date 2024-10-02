const axios = require("axios");
require("dotenv").config();
const { prismaConnection } = require("../prisma/prisma");

module.exports = {
  /**
   * Generate a payment using the Flouci API.
   */
  generatePayment: async (req, res) => {
    try {
      const { amount, developerTrackingId, orderId } = req.body;
      console.log(amount, developerTrackingId, orderId);
      
      const response = await axios.post(
        "https://developers.flouci.com/api/generate_payment",
        {
          app_token: process.env.FLOUCI_APP_TOKEN,
          app_secret: process.env.FLOUCI_APP_SECRET,
          amount: amount * 1000, // Amount in the smallest currency unit (e.g., cents)
          accept_card: "true",
          session_timeout_secs: 1200, // Session timeout in seconds
          success_link: `${process.env.SUCCESS_LINK}?orderId=${orderId}`,
          fail_link: process.env.FAILED_LINK,
          developer_tracking_id: developerTrackingId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("-------flouci response; ------- ", response);
      res.json(response.data);
    } catch (error) {
      console.error("Error generating payment:", error);
      res.status(500).json({ error: "Failed to generate payment" });
    }
  },

  /**
   * Update the payment method for an order.
   */
  updatePaymentMethod: async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    try {
      // Check if the order exists
      const order = await prismaConnection.order.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update the payment method for all payments associated with the orderId
      const updatedPayments = await prismaConnection.payment.updateMany({
        where: { orderId: parseInt(orderId) },
        data: {
          paymentMethod: paymentMethod,
          status: "PAID", // Update the status to "PAID"
        },
      });

      if (updatedPayments.count === 0) {
        return res.status(404).json({ message: "No payments found for the given order ID" });
      }

      res.status(200).json({
        message: "Payment method updated successfully for all related payments",
        updatedPayments,
      });
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Error updating payment" });
    }
  },
};
