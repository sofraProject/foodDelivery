"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation"; // Importation correcte
import { useEffect } from "react";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;
const PaymentFailure = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Utiliser useSearchParams pour extraire les paramètres d'URL
  const orderId = searchParams.get("orderId"); // Récupérer orderId depuis les paramètres d'URL

  useEffect(() => {
    if (orderId) {
      axios
        .put(`${serverDomain}/api/orders/${orderId}/failure`)
        .then((response) => {
          console.log("Order updated to FAILED", response.data);
        })
        .catch((error) => {
          console.error("Error updating order status", error);
        });
    }
  }, [orderId]);

  return (
    <div className="container py-10 mx-auto text-center">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="mt-4 text-lg">
        Unfortunately, your payment failed. Please try again or contact support.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 mt-6 text-white bg-blue-600 rounded-lg"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentFailure;
