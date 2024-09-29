const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order.controller"); // Assurez-vous que ce chemin est correct

// Créer une nouvelle commande
router.post("/", OrderController.createOrder);

// Obtenir toutes les commandes (Admin seulement)
router.get("/", OrderController.getAllOrders);

// Obtenir les commandes avec le statut CONFIRMED
router.get("/status/confirmed", OrderController.getConfirmedOrders);

// Obtenir une commande par ID
router.get("/:id", OrderController.getOrderById);

// Mettre à jour une commande par ID (peut inclure la mise à jour du statut)
router.put("/:id", OrderController.updateOrderStatus);

// Supprimer une commande par ID
router.delete("/:id", OrderController.deleteOrder);

// Obtenir les données du tableau de bord de l'utilisateur
router.get("/dashboard/user", OrderController.getDashboardData);

// Route pour paiement réussi
router.put("/:id/success", OrderController.updateOrderPaymentSuccess);

// Route pour paiement échoué
router.put("/:id/failure", OrderController.updateOrderPaymentFailure);

// Route pour confirmer la commande
router.put("/:id/confirm", OrderController.confirmOrder);

// Route pour ready la commande
router.put("/:id/ready", OrderController.updateOrderToReady);

// Route pour assigner uniquement un chauffeur à une commande (sans changement de statut)
router.put("/:id/assign-driver", OrderController.assignDriver);

module.exports = router;
