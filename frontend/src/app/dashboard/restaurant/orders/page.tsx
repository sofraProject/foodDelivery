"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const serverDomain =
  process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000"; // Provide a default value

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching orders.");
        setLoading(false);
      }
    };

    fetchOrders();

    // Check if serverDomain is defined
    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    const socket = io(serverDomain); // Ensure serverDomain is defined

    // Listen for payment confirmation events
    socket.on("orderPaymentConfirmed", (data: { orderId: number }) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.orderId ? { ...order, status: "CONFIRMED" } : order
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleConfirmOrder = async (orderId: number) => {
    try {
      await axios.put(`${serverDomain}/api/orders/${orderId}/confirm`);

      const socket = io(serverDomain);
      socket.emit("orderConfirmed", { orderId }); // Emit order confirmation
      socket.disconnect();
    } catch (error) {
      console.error("Error confirming order", error);
    }
  };

  const handleMakeReady = async (orderId: number) => {
    try {
      await axios.put(`${serverDomain}/api/orders/${orderId}/ready`); // Update the order status to "READY"

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "READY" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order to READY", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading orders...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">Manage Orders</h1>
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
                  <p className="text-sm text-gray-500">{`Status: ${order.status}`}</p>
                </div>
                {order.status === "PAID" && (
                  <button
                    onClick={() => handleConfirmOrder(order.id)}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Confirm Order
                  </button>
                )}
                {order.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleMakeReady(order.id)}
                    className="px-4 py-2 ml-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Make Ready
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
