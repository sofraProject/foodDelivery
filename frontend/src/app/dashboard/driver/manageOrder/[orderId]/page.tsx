"use client";
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
  items?: Array<{ name: string; quantity: number; price: number }>; // Typing for items in the order
  restaurant?: { name: string }; // Typing for the restaurant details
};

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE; // Fetch from environment

const ManageOrderPage = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId; // Ensure we retrieve the order ID correctly

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
  }, [orderId]);

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
              onClick={() => console.log("Mark as on route")} // Add the logic here
              className="w-full px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Mark as On Route
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManageOrderPage;
