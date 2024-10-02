"use client";
import useSocket from "@/hooks/useSocket"; // Import your custom hook
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineDollar,
  AiOutlineFileDone,
  AiOutlineShop,
} from "react-icons/ai";

// Typing for the received order data
type OrderData = {
  orderId: number;
  restaurantId: number;
  totalPrice: number;
  status: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  restaurant?: { name: string };
};

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE; // Fetch from environment

const ManageOrderPage = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false); // State to handle the updating process
  const router = useRouter();
  const params = useParams();

  // Ensure we retrieve the order ID correctly and convert to a number
  const orderId = Array.isArray(params.orderId)
    ? parseInt(params.orderId[0], 10)
    : parseInt(params.orderId, 10);

  // Initialize the socket connection using the custom useSocket hook
  const socket = useSocket(`${serverDomain}`);

  // Combined function to fetch order and restaurant details
  const fetchOrderAndRestaurantDetails = async () => {
    try {
      const orderResponse = await axios.get(
        `${serverDomain}/api/orders/${orderId}`
      );
      const fetchedOrder = orderResponse.data;

      // Fetch restaurant details after we have the order data
      const restaurantResponse = await axios.get(
        `${serverDomain}/api/restaurants/${fetchedOrder.restaurantId}`
      );
      const restaurant = restaurantResponse.data;

      // Combine the order and restaurant details into one state
      setOrder({
        ...fetchedOrder,
        restaurant: { name: restaurant.name },
      });
      setLoading(false);
    } catch (error) {
      setError("Error fetching order or restaurant details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderAndRestaurantDetails();
    }

    // Ensure the socket connection exists
    if (socket) {
      // Subscribe to the "orderStatusUpdated" event
      socket.on("orderStatusUpdated", (updatedOrder: OrderData) => {
        if (updatedOrder.orderId === orderId) {
          // Now comparing as numbers
          setOrder(updatedOrder);
        }
      });

      // Cleanup socket connection on unmount
      return () => {
        socket.off("orderStatusUpdated"); // Remove the listener when the component unmounts
      };
    }
  }, [orderId, socket]);

  // Function to update the order status
  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      // Send PUT request to update the order status
      await axios.put(`${serverDomain}/api/orders/${orderId}/update-status`, {
        status: newStatus,
      });

      // Update the local order status
      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: newStatus } : prevOrder
      );
      setUpdating(false);
    } catch (error) {
      console.error("Error updating the order status:", error);
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading order details...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">
            Manage Order #{orderId}
          </h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Order Details</h2>
            <div className="mb-4">
              <AiOutlineShop className="inline mr-2" />
              Restaurant: {order?.restaurant?.name}
            </div>
            <div className="mb-4">
              <AiOutlineFileDone className="inline mr-2" />
              Status: {order?.status}
            </div>
            <div className="mb-4">
              <AiOutlineDollar className="inline mr-2" />
              Total: {order?.totalPrice} TND
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-6">
            <button
              onClick={() => updateOrderStatus("EXPEDITED")}
              disabled={updating}
              className={`w-full px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Mark as Expedited"}
            </button>
            <button
              onClick={() => updateOrderStatus("TORESTO")}
              disabled={updating}
              className={`w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Mark as To Restaurant"}
            </button>
            <button
              onClick={() => updateOrderStatus("TOCUSTOMER")}
              disabled={updating}
              className={`w-full px-6 py-2 mt-4 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Mark as To Customer"}
            </button>
            <button
              onClick={() => updateOrderStatus("DELIVERED")}
              disabled={updating}
              className={`w-full px-6 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Mark as Delivered"}
            </button>
            <button
              onClick={() => updateOrderStatus("UNAVAILABLE")}
              disabled={updating}
              className={`w-full px-6 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700 ${
                updating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Mark as Unavailable"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageOrderPage;
