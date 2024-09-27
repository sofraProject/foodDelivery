const { prismaConnection } = require("../prisma/prisma");

module.exports = {
  // Créer une nouvelle commande
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      console.log("Requête reçue :", req.body); // Étape 1 : Vérifier le corps de la requête

      const { items, user } = req.body;
      const userId = user.id; // Assurez-vous que l'utilisateur est bien récupéré
      console.log("ID utilisateur récupéré :", userId); // Étape 2 : Vérifier l'ID de l'utilisateur

      if (!userId) {
        console.error("Erreur : L'ID utilisateur est manquant"); // Étape 3 : Log en cas d'erreur utilisateur
        return res.status(400).json({ message: "User ID is missing" });
      }

      // Créer une commande avec un montant total initial à zéro
      const order = await prismaConnection.order.create({
        data: {
          user_id: userId, // Lier la commande à l'utilisateur
          status: "pending",
          total_amount: 0,
        },
      });
      console.log("Commande créée avec succès :", order); // Étape 4 : Vérifier si la commande a été créée

      let totalAmount = 0;

      // Boucle sur les items pour les ajouter à OrderItem
      for (const item of items) {
        console.log("Traitement de l'item :", item); // Étape 5 : Log avant traitement de chaque item

        const menuItem = await prismaConnection.menuItem.findUnique({
          where: { id: item.id },
        });
        if (!menuItem) {
          console.error(
            `Erreur : L'article de menu avec l'ID ${item.id} n'a pas été trouvé`
          ); // Étape 6 : Log en cas d'item non trouvé
          throw new Error(`Menu item with id ${item.id} not found`);
        }

        console.log("Article de menu trouvé :", menuItem); // Étape 7 : Log de l'article de menu trouvé

        // Créer l'élément de la commande
        await prismaConnection.orderItem.create({
          data: {
            order_id: order.id,
            menu_item_id: item.id,
            quantity: item.quantity,
            price: menuItem.price,
          },
        });
        console.log("Élément de la commande créé :", {
          orderId: order.id,
          itemId: item.id,
        }); // Étape 8 : Log après la création d'un OrderItem

        // Calculer le montant total
        totalAmount += menuItem.price * item.quantity;
      }

      console.log("Montant total calculé :", totalAmount); // Étape 9 : Log du montant total calculé

      // Mettre à jour le montant total de la commande
      await prismaConnection.order.update({
        where: { id: order.id },
        data: { total_amount: totalAmount },
      });
      console.log("Commande mise à jour avec le montant total :", totalAmount); // Étape 10 : Log après mise à jour de la commande

      // Assigner un livreur (pour simplifier, le premier disponible est assigné)
      const driver = await prismaConnection.user.findFirst({
        where: { role: "driver" },
      });
      console.log("Livreur trouvé :", driver); // Étape 11 : Log du livreur trouvé

      if (driver) {
        const delivery = await prismaConnection.delivery.create({
          data: {
            order_id: order.id,
            driver_id: driver.id,
            status: "assigned",
            current_latitude: 0, // Coordonnées temporaires
            current_longitude: 0, // Coordonnées temporaires
          },
        });

        console.log("Livraison créée avec succès :", delivery); // Étape 12 : Log après création de la livraison

        // Répondre avec les informations de livraison
        return res.status(201).json({
          message: "Order created successfully",
          order,
          delivery: {
            id: delivery.id,
            driver: {
              name: driver.name,
              email: driver.email,
            },
          },
        });
      } else {
        console.warn("Aucun livreur disponible"); // Étape 13 : Log si aucun livreur n'est disponible
        return res.status(201).json({
          message: "Order created successfully, but no driver available",
          order,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error); // Étape 14 : Log en cas d'erreur générale
      res
        .status(400)
        .json({ message: "Error creating order", error: error.message });
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (req, res) => {
    try {
      const order = await prismaConnection.order.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          orderItems: true,
          delivery: true,
        },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res
        .status(400)
        .json({ message: "Error fetching order", error: error.message });
    }
  },

  // Mettre à jour une commande
  updateOrder: async (req, res) => {
    try {
      const updatedOrder = await prismaConnection.order.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res
        .status(400)
        .json({ message: "Error updating order", error: error.message });
    }
  },

  // Supprimer une commande
  deleteOrder: async (req, res) => {
    try {
      await prismaConnection.order.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting order:", error);
      res
        .status(400)
        .json({ message: "Error deleting order", error: error.message });
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId, status } = req.body;
      const order = await prismaConnection.order.findUnique({
        where: { id: parseInt(orderId) },
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      await prismaConnection.order.update({
        where: { id: parseInt(orderId) },
        data: { status },
      });

      // Mettre à jour le statut de la livraison
      const delivery = await prismaConnection.delivery.findFirst({
        where: { order_id: orderId },
      });
      if (delivery) {
        await prismaConnection.delivery.update({
          where: { id: delivery.id },
          data: { status },
        });
      }

      // Émission d'un événement socket pour notifier les clients
      req.app.get("io").emit(`orderStatus-${orderId}`, { status });

      res
        .status(200)
        .json({ message: "Order status updated successfully", order });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error updating order status", error: error.message });
    }
  },

  // Récupérer les données du tableau de bord
  getDashboardData: async (req, res) => {
    try {
      const userId = req.user.id;

      const totalOrders = await prismaConnection.order.count({
        where: { user_id: userId },
      });

      const pendingOrders = await prismaConnection.order.count({
        where: { user_id: userId, status: "pending" },
      });

      const completedOrders = await prismaConnection.order.count({
        where: { user_id: userId, status: "completed" },
      });

      const revenue = await prismaConnection.order.aggregate({
        where: { user_id: userId },
        _sum: {
          total_amount: true,
        },
      });

      res.status(200).json({
        totalOrders,
        pendingOrders,
        completedOrders,
        revenue: revenue._sum.total_amount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Récupérer toutes les commandes
  getAllOrders: async (req, res) => {
    try {
      const orders = await prismaConnection.order.findMany({
        include: {
          orderItems: {
            include: {
              menuItem: true, // Inclure les détails des articles de menu
            },
          },
          delivery: {
            include: {
              driver: {
                select: {
                  name: true, // Récupérer le nom du livreur
                  email: true, // Récupérer l'email du livreur
                },
              },
            },
          },
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
};
