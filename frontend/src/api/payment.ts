import axios from "axios";
import { getUserId } from "../helpers/authHelper"; // Importation du helper pour obtenir l'ID utilisateur

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

export const handlePayment = async (
  cartItems: Array<{
    id: number;
    price: number;
    quantity: number;
  }>, // Typage des articles du panier
  totalPrice: number,
  token: string,
  restaurantId: number, // ID du restaurant
  paymentMethod: string // Méthode de paiement
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Récupération de l'ID utilisateur
    const user = getUserId();
    // Vérification si l'ID utilisateur est présent
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Étape 1 : Créer la commande via l'API
    const orderResponse = await axios.post(
      `${serverDomain}/api/orders`,
      {
        items: cartItems, // Les articles de la commande
        user, // ID de l'utilisateur
        restaurantId, // ID du restaurant
        paymentMethod, // Méthode de paiement (ex: 'flouci')
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Utilisation du token pour l'authentification
        },
      }
    );

    const { order } = orderResponse.data;

    // Étape 2 : Générer le paiement via l'API (si nécessaire)
    const paymentResponse = await axios.post(
      `${serverDomain}/api/payment/generatePayment`,
      {
        amount: Math.round(totalPrice), // Prix total arrondi
        developerTrackingId: `order_${Math.random()}`, // ID de suivi unique
        orderId: order.id, // Utilisation de l'ID de la commande nouvellement créée
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Utilisation du token pour l'authentification
        },
      }
    );

    // Étape 3 : Redirection vers le lien de paiement
    if (paymentResponse.data.result && paymentResponse.data.result.link) {
      window.location.href = paymentResponse.data.result.link; // Redirection vers le lien de paiement
    } else {
      throw new Error("Payment link not found");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error generating payment:", error.message);
    return { success: false, error: error.message };
  }
};
