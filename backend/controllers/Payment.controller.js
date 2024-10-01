const axios = require("axios");
require("dotenv").config();
const { prismaConnection } = require("../prisma/prisma");
module.exports = {
  generatePayment: async (req, res) => {
    try {
      const { amount, developerTrackingId, orderId } = req.body;
      console.log(amount, developerTrackingId, orderId);
      const response = await axios.post(
        "https://developers.flouci.com/api/generate_payment",
        {
          app_token: process.env.FLOUCI_APP_TOKEN,
          app_secret: process.env.FLOUCI_APP_SECRET,
          amount: amount * 1000,
          accept_card: "true",
          session_timeout_secs: 1200,
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
      console.log("-------flouci response ; ------- ", response);
      res.json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to generate payment" });
    }
  },
  // Contrôleur pour mettre à jour la méthode de paiement
  updatePaymentMethod: async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    try {
      // Vérifier si la commande existe
      const order = await prismaConnection.order.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Mettre à jour la méthode de paiement pour tous les paiements associés à l'orderId
      const updatedPayments = await prismaConnection.payment.updateMany({
        where: { orderId: parseInt(orderId) },
        data: {
          paymentMethod: paymentMethod,
          status: "PAID",
        },
      });

      if (updatedPayments.count === 0) {
        return res
          .status(404)
          .json({ message: "No payments found for the given order ID" });
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
