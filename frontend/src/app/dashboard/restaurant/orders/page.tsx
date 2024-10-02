"use client";
import useSocket from "@/hooks/useSocket";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "";

// Type pour les commandes
interface Order {
  id: number;
  totalPrice: number;
  status: string;
}

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const socket = useSocket(serverDomain);

  // Fonction générique pour mettre à jour le statut d'une commande
  const updateOrderStatus = (orderId: number, status: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération des commandes.");
        setLoading(false);
      }
    };

    fetchOrders();

    if (!socket) return;

    // Gérer les mises à jour via Socket.io
    socket.on("orderConfirmed", (data: { orderId: number }) => {
      updateOrderStatus(data.orderId, "CONFIRMED");
    });

    socket.on(
      "orderStatusUpdated",
      (data: { orderId: number; status: string }) => {
        updateOrderStatus(data.orderId, data.status);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleOrderAction = async (
    url: string,
    orderId: number,
    newStatus: string
  ) => {
    try {
      await axios.put(`${serverDomain}/api/orders/${orderId}/${url}`);
      updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la commande ${orderId}`,
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Chargement des commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <h1 className="text-5xl font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Pending Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{`Order #${order.id}`}</h3>
                  <p className="text-sm text-gray-500">{`Total: ${order.totalPrice} TND`}</p>
                  <p className="text-sm text-gray-500">{`Statut: ${order.status}`}</p>
                </div>
                {order.status === "PAID" && (
                  <button
                    onClick={() =>
                      handleOrderAction("confirm", order.id, "CONFIRMED")
                    }
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Confirm
                  </button>
                )}
                {order.status === "CONFIRMED" && (
                  <button
                    onClick={() =>
                      handleOrderAction("ready", order.id, "READY")
                    }
                    className="px-4 py-2 ml-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Ready for Delivery
                  </button>
                )}
                {(order.status === "PAID" || order.status === "CONFIRMED") && (
                  <button
                    onClick={() =>
                      handleOrderAction("cancel", order.id, "CANCELED")
                    }
                    className="px-4 py-2 ml-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RestaurantOrdersPage;
