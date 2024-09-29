"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import io from "socket.io-client";
import swal from "sweetalert";

// Environment variable for server domain
const serverDomain =
  process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const ConfirmedOrdersPage = () => {
  // State management for orders, loading, error, and notifications
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(null);

  // Router instance
  const router = useRouter();

  // Fetch confirmed orders on component mount
  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const response = await axios.get(
          `${serverDomain}/api/orders/status/confirmed`
        );
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching orders.");
        setLoading(false);
      }
    };

    fetchConfirmedOrders();

    // Socket.io connection for real-time updates
    const socket = io(serverDomain);

    socket.on("orderPaymentConfirmed", (data: { orderId: number }) => {
      setOrders((prevOrders) => [...prevOrders, data]);
      setNotification(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleManageOrder = (orderId: number) => {
    router.push(`/dashboard/driver/manageOrder/${orderId}`);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <AiOutlineLoading3Quarters className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-4 text-xl">Loading orders...</span>
      </div>
    );
  }

  // Error state
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
          <h1 className="text-5xl font-bold text-gray-900">Orders</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        {notification &&
          swal({
            title: "New confirmed order!",
            text: `Order ID: ${notification.orderId}`,
            icon: "info",
            buttons: {
              manageOrder: {
                text: "Manage Order",
                value: "manage",
                className: "swal-button swal-button--manage",
              },
              close: {
                text: "Close",
                value: "close",
                className: "swal-button swal-button--close",
              },
            },
          }).then((value) => {
            switch (value) {
              case "manage":
                handleManageOrder(notification.orderId);
                break;
              case "close":
                closeNotification();
                break;
            }
          })}

        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Confirmed Orders</h2>

          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center">
                    <AiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">
                        {`#${order?.id ? "Order " + order.id : "New Order"}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {`Total: ${
                          order?.totalPrice
                            ? order.totalPrice + " TND"
                            : "NOT AVAILABLE FOR NOW"
                        }`}
                      </p>
                      <p className="text-sm text-gray-500">{`Status: ${
                        order.status || "CONFIRMED"
                      }`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleManageOrder(order.id)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Manage
                  </button>
                </motion.div>
              ))
            ) : (
              <p className="text-lg text-gray-500">
                No confirmed orders available.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ConfirmedOrdersPage;
