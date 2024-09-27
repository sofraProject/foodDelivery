import axios from "axios";
import swal from "sweetalert";
import { getUser } from "../helpers/authHelper";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

// Fonction pour gérer le paiement
export const handlePayment = async (
  cartItems: any[], // Vous pouvez ajuster ce type selon votre structure
  totalPrice: number,
  token: string,
  router: any // Next.js router
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Créer une commande via une API Next.js
    const orderResponse = await axios.post(
      `${serverDomain}/api/orders`,
      {
        items: cartItems,
        user: getUser(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Générer un paiement via une API Next.js
    const paymentResponse = await axios.post(
      `${serverDomain}/api/payment/generatePayment`,
      {
        amount: Math.round(totalPrice),
        developerTrackingId: `order_${Math.random()}`,
        orderId: orderResponse.data.order.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ouvrir le lien de paiement dans un nouvel onglet
    if (paymentResponse.data.result && paymentResponse.data.result.link) {
      window.open(paymentResponse.data.result.link, "_blank");
    } else {
      throw new Error("Payment link not found");
    }

    const { order, delivery } = orderResponse.data;

    if (delivery) {
      swal(
        "Congratulations!!!",
        `Your order has been placed successfully. Order ID: ${order.id}\nDriver: ${delivery.driver.name}\nDriver Phone: ${delivery.driver.email}`,
        "success"
      );
    } else {
      swal(
        "Order Placed",
        `Your order has been placed successfully. Order ID: ${order.id}\nNo driver is currently available. Please check back later.`,
        "success"
      );
      router.push("/orders"); // Redirection vers la page des commandes
    }

    return { success: true }; // Indiquer que tout s'est bien passé
  } catch (error: any) {
    console.error("Error placing order:", error.message);
    swal("Error", "Failed to place order. Please try again.", "error");
    return { success: false, error: error.message }; // Retourner l'erreur
  }
};
