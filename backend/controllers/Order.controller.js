const { prismaConnection } = require("../prisma/prisma");
const { getIoInstance } = require("../socketManager");
module.exports = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      // Log de la requête initiale
      console.log("Request body:", req.body);
      const { items, user, restaurantId, paymentMethod } = req.body;
      const customerId = user;

      // Vérification des paramètres requis
      if (!customerId || !items.length || !restaurantId || !paymentMethod) {
        console.log("Validation failed: missing fields");
        return res.status(400).json({
          message:
            "Missing required fields: customerId, restaurantId, or items",
        });
      }

      // Validation de l'existence du restaurant
      const restaurant = await prismaConnection.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        console.log(`Restaurant not found for ID: ${restaurantId}`);
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Création de la commande avec statut initial "PENDING"
      const order = await prismaConnection.order.create({
        data: {
          customerId,
          restaurantId,
          status: "PENDING", // Enum pour le statut
          totalPrice: 0, // Prix initial
        },
      });
      console.log("Order created:", order);

      let totalAmount = 0;

      // Boucle pour valider les articles et calculer le total
      for (const item of items) {
        console.log(`Processing item with ID: ${item.id}`);
        const menuItem = await prismaConnection.menuItem.findUnique({
          where: { id: item.id },
        });

        if (!menuItem) {
          console.log(`Menu item with ID: ${item.id} not found`);
          throw new Error(`Menu item with id ${item.id} not found`);
        }

        // Création des articles de commande
        await prismaConnection.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: item.id,
            quantity: item.quantity,
            price: menuItem.price,
          },
        });

        console.log(`Order item created for menuItem ID: ${item.id}`);

        // Calcul du montant total
        totalAmount += menuItem.price * item.quantity;
      }

      console.log(`Total amount calculated: ${totalAmount}`);

      // Mise à jour du prix total de la commande
      await prismaConnection.order.update({
        where: { id: order.id },
        data: { totalPrice: totalAmount },
      });
      console.log("Order total price updated:", totalAmount);

      // Gestion du paiement
      const payment = await prismaConnection.payment.create({
        data: {
          orderId: order.id,
          paymentMethod,
          amount: totalAmount,
          status: "PENDING", // Statut initial PENDING
        },
      });
      console.log("Payment created:", payment);

      // Simulation de confirmation de paiement (exemple pour un paiement par carte)
      if (paymentMethod === "CARD") {
        console.log("Processing card payment...");
        await prismaConnection.payment.update({
          where: { id: payment.id },
          data: { status: "PAID" },
        });

        // Mise à jour du statut de la commande après confirmation du paiement
        await prismaConnection.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        });

        console.log("Order payment status updated to PAID");

        // Envoyer une notification à l'utilisateur
        await prismaConnection.notification.create({
          data: {
            userId: customerId,
            orderId: order.id,
            message: `Your order #${order.id} has been successfully paid!`,
          },
        });
        console.log(`Notification sent to user ${customerId}`);
      }

      // Répondre avec la commande créée et le paiement
      return res.status(201).json({
        message: "Order created successfully",
        order,
        payment,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  },

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await prismaConnection.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              menuItem: true, // Include menu item details
            },
          },
          delivery: {
            include: {
              driver: { select: { name: true, email: true } },
            },
          },
          payments: true, // Include payment details
        },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res
        .status(500)
        .json({ message: "Error fetching order", error: error.message });
    }
  },

  // Update order status (e.g., PENDING -> CONFIRMED -> PREPARING -> DELIVERED)
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = [
        "PENDING",
        "PAID",
        "CONFIRMED",
        "PREPARING",
        "DELIVERED",
        "CANCELED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }

      const updatedOrder = await prismaConnection.order.update({
        where: { id: parseInt(req.params.id) },
        data: { status },
      });

      // Optionally, send a notification when the order status is updated
      await prismaConnection.notification.create({
        data: {
          userId: updatedOrder.customerId,
          orderId: updatedOrder.id,
          message: `Your order #${updatedOrder.id} status has been updated to ${status}`,
        },
      });

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res
        .status(500)
        .json({ message: "Error updating order status", error: error.message });
    }
  },

  // Delete order
  deleteOrder: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);

      // Check if the order exists before deleting
      const order = await prismaConnection.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Delete the order
      await prismaConnection.order.delete({
        where: { id: orderId },
      });

      // Optionally, send a notification when the order is deleted
      await prismaConnection.notification.create({
        data: {
          userId: order.customerId,
          message: `Your order #${order.id} has been deleted.`,
        },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting order:", error);
      res
        .status(500)
        .json({ message: "Error deleting order", error: error.message });
    }
  },

  // Fetch dashboard data for the user
  getDashboardData: async (req, res) => {
    try {
      const userId = req.user.id;

      const totalOrders = await prismaConnection.order.count({
        where: { customerId: userId },
      });

      const pendingOrders = await prismaConnection.order.count({
        where: { customerId: userId, status: "PENDING" },
      });

      const completedOrders = await prismaConnection.order.count({
        where: { customerId: userId, status: "DELIVERED" },
      });

      const revenue = await prismaConnection.order.aggregate({
        where: { customerId: userId },
        _sum: {
          totalPrice: true,
        },
      });

      res.status(200).json({
        totalOrders,
        pendingOrders,
        completedOrders,
        revenue: revenue._sum.totalPrice || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all orders (Admin access)
  getAllOrders: async (req, res) => {
    try {
      const orders = await prismaConnection.order.findMany({
        include: {
          orderItems: {
            include: {
              menuItem: true, // Include menu item details
            },
          },
          deliveries: {
            include: {
              driver: { select: { name: true, email: true } },
            },
          },
          payments: true,
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res
        .status(400)
        .json({ message: "Error fetching orders", error: error.message });
    }
  },
  updateOrderPaymentSuccess: async (req, res) => {
    try {
      const { id } = req.params;

      // Mise à jour de la commande à "PAID"
      const order = await prismaConnection.order.update({
        where: { id: parseInt(id) },
        data: { status: "PAID" },
      });

      // Optionnel: Envoi d'une notification à l'utilisateur
      await prismaConnection.notification.create({
        data: {
          userId: order.customerId,
          orderId: order.id,
          message: `Your order #${order.id} has been successfully paid!`,
        },
      });

      return res.status(200).json({
        message: "Order successfully updated to PAID",
        order,
      });
    } catch (error) {
      console.error("Error updating order payment to PAID:", error);
      return res
        .status(500)
        .json({ message: "Error updating payment", error: error.message });
    }
  },
  updateOrderPaymentFailure: async (req, res) => {
    try {
      const { id } = req.params;

      // Mise à jour de la commande à "FAILED"
      const order = await prismaConnection.order.update({
        where: { id: parseInt(id) },
        data: { status: "FAILED" },
      });

      // Optionnel: Envoi d'une notification à l'utilisateur
      await prismaConnection.notification.create({
        data: {
          userId: order.customerId,
          orderId: order.id,
          message: `Payment for your order #${order.id} has failed.`,
        },
      });

      return res.status(200).json({
        message: "Order payment failed and updated to FAILED",
        order,
      });
    } catch (error) {
      console.error("Error updating order payment to FAILED:", error);
      return res
        .status(500)
        .json({ message: "Error updating payment", error: error.message });
    }
  },

  // Méthode pour confirmer une commande
  confirmOrder: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await prismaConnection.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Mise à jour du statut de la commande
      const updatedOrder = await prismaConnection.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" }, // Statut mis à jour
      });

      // Émettre un événement de confirmation de commande
      const io = getIoInstance(); // Récupération de l'instance de socket.io
      io.emit("orderPaymentConfirmed", { orderId: updatedOrder.id });

      return res.status(200).json({
        message: "Order successfully confirmed",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      return res
        .status(500)
        .json({ message: "Error confirming order", error: error.message });
    }
  },
  // Inside your Order.controller.js
  updateOrderToReady: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await prismaConnection.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await prismaConnection.order.update({
        where: { id: orderId },
        data: { status: "READY" },
      });

      // Emit a Socket.IO event if needed
      const io = getIoInstance();
      io.emit("orderStatusUpdated", {
        orderId: updatedOrder.id,
        status: "READY",
      });

      return res.status(200).json({
        message: "Order successfully set to READY",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error updating order to READY:", error);
      return res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  },
  // Méthode pour assigner un driverId à une commande sans changer le statut
  assignDriver: async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { driverId } = req.body; // Récupérer le driverId du corps de la requête

      const order = await prismaConnection.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Assigner uniquement le driverId sans changer le statut
      const updatedOrder = await prismaConnection.order.update({
        where: { id: orderId },
        data: { driverId },
      });

      // Émettre un événement via Socket.IO si nécessaire
      const io = getIoInstance();
      io.emit("driverAssigned", { orderId: updatedOrder.id, driverId });

      return res.status(200).json({
        message: "Driver assigned successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error("Error assigning driver:", error);
      return res.status(500).json({
        message: "Error assigning driver",
        error: error.message,
      });
    }
  },
  getConfirmedOrders: async (req, res) => {
    try {
      const confirmedOrders = await prismaConnection.order.findMany({
        where: { status: "CONFIRMED" },
        include: {
          orderItems: true,
          restaurant: true,
          customer: true,
        },
      });

      res.status(200).json(confirmedOrders);
    } catch (error) {
      console.error("Error fetching confirmed orders:", error);
      res.status(500).json({ message: "Error fetching confirmed orders" });
    }
  },

// Inside your Order.controller.js

// Cancel an order
cancelOrder: async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    // Check if the order exists
    const order = await prismaConnection.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status to "CANCELED"
    const updatedOrder = await prismaConnection.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" },
    });

    // Optionally, send a notification when the order is canceled
    await prismaConnection.notification.create({
      data: {
        userId: updatedOrder.customerId,
        orderId: updatedOrder.id,
        message: `Your order #${updatedOrder.id} has been canceled.`,
      },
    });

    return res.status(200).json({
      message: "Order successfully canceled",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res
      .status(500)
      .json({ message: "Error canceling order", error: error.message });
  }
},


};


