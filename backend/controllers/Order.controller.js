const { prismaConnection } = require("../prisma/prisma");

module.exports = {
  // Créer une nouvelle commande
  createOrder: async (req, res) => {
    try {
      const { items, user } = req.body;
      const userId = user.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID is missing" });
      }

      // Créer une commande
      const order = await prismaConnection.order.create({
        data: {
          user_id: userId,
          status: "pending",
          total_amount: 0,
        },
      });

      let totalAmount = 0;

      for (const item of items) {
        const menuItem = await prismaConnection.menuItem.findUnique({
          where: { id: item.id },
        });
        if (!menuItem) {
          throw new Error(`Menu item with id ${item.id} not found`);
        }

        // Créer l'élément de commande
        await prismaConnection.orderItem.create({
          data: {
            order_id: order.id,
            menu_item_id: item.id,
            quantity: item.quantity,
            price: menuItem.price,
          },
        });

        // Calcul du montant total
        totalAmount += menuItem.price * item.quantity;
      }

      // Mise à jour du montant total de la commande
      await prismaConnection.order.update({
        where: { id: order.id },
        data: { total_amount: totalAmount },
      });

      return res
        .status(201)
        .json({ message: "Order created successfully", order });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await prismaConnection.order.findUnique({
        where: { id: Number(id) },  // Assurez-vous que l'ID est un nombre
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          deliveries: {  // Vérifiez ici que "deliveries" est correct
            include: {
              driver: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: true,  // Inclure l'utilisateur si nécessaire
        },
      });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      return res.status(200).json(order);
    } catch (error) {
      console.error(error); // Ajoutez ce log pour voir l'erreur dans la console
      return res.status(500).json({ message: "Error fetching order", error: error.message });
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
      res
        .status(500)
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
      res
        .status(500)
        .json({ message: "Error deleting order", error: error.message });
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
          deliveries: {
            include: {
              driver: {
                select: {
                  name: true, // Récupérer le nom du livreur
                  email: true, // Récupérer l'email du livreur
                },
              },
            },
          },
          user: true
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
  getOrdersByUserId: async (req, res) => {
    try {
      const { userId } = req.params; 
      
      const orders = await prismaConnection.order.findMany({
        where: { user_id: parseInt(userId),status: 'pending' }, 
        include: {
          orderItems: {
            include: {
              menuItem: true, 
            },
          },
          deliveries: {
            include: {
              driver: {
                select: {
                  name: true, 
                  email: true, 
                },
              },
            },
          },
          user: true, 
        },
      });

      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }

      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders for user:", error);
      return res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  },
};
