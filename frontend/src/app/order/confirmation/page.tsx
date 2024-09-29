"use client";

import axios from "axios";
import { motion } from "framer-motion"; // Import framer-motion for animations
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { removeItemsByRestaurantId } from "../../../redux/features/cartSlice";

// Define types for order data and socket data
type OrderData = {
  order: {
    id: number;
    restaurantId: number;
  };
};

type SocketData = {
  orderId: number;
};

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const dispatch = useDispatch();
  const [orderStatus, setOrderStatus] = useState(0); // 0: Pending, 1: Confirmed, 2: Preparing, 3: Awaiting Delivery, 4: Delivered

  // Function to handle order update
  const updateOrderStatus = (status: number) => setOrderStatus(status);

  useEffect(() => {
    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    const socket = io(serverDomain);

    if (orderId) {
      // Update order and remove items from cart
      axios
        .put<OrderData>(`${serverDomain}/api/orders/${orderId}/success`)
        .then((response) => {
          const restaurantId = response.data.order.restaurantId;
          dispatch(removeItemsByRestaurantId(restaurantId));
        })
        .catch((error) => {
          console.error("Error updating the order status", error);
        });

      // Socket events for order status updates
      socket.on("orderPaymentConfirmed", (data: SocketData) => {
        if (data.orderId === Number(orderId)) updateOrderStatus(1);
      });

      socket.on("orderPreparationStarted", (data: SocketData) => {
        if (data.orderId === Number(orderId)) updateOrderStatus(2);
      });

      socket.on("orderStatusUpdated", (data: SocketData) => {
        if (data.orderId === Number(orderId)) updateOrderStatus(3);
      });

      socket.on("deliveryConfirmed", (data: SocketData) => {
        if (data.orderId === Number(orderId)) updateOrderStatus(4);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [orderId, dispatch]);

  // Order steps definition using useMemo to avoid recalculating on each render
  const steps = useMemo(
    () => [
      {
        text: "Waiting for restaurant confirmation...",
        loading: orderStatus === 0,
        status: 0,
      },
      {
        text: "Restaurant confirmed!",
        loading: orderStatus === 1,
        status: 1,
      },
      {
        text: "Restaurant is preparing your order...",
        loading: orderStatus === 2,
        status: 2,
      },
      {
        text: "Waiting for delivery confirmation...",
        loading: orderStatus === 3,
        status: 3,
      },
      {
        text: "Delivery confirmed!",
        loading: orderStatus === 4,
        status: 4,
      },
    ],
    [orderStatus]
  );

  // Helper function to render step icons
  const renderIcon = (loading: boolean) =>
    loading ? (
      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
    ) : (
      <AiOutlineCheckCircle className="w-5 h-5" />
    );

  // JSX for each step
  const renderSteps = steps.map((step) => (
    <motion.li
      key={step.status}
      className={`flex items-center ${
        orderStatus >= step.status ? "text-green-600" : "text-gray-600"
      } mb-4`}
      initial={{ opacity: 0, y: 20 }} // Fade-in animation
      animate={{ opacity: 1, y: 0 }} // Appears in normal position
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }} // Hover effect
    >
      {renderIcon(step.loading)}
      <span className="ml-2 text-xl">{step.text}</span>
    </motion.li>
  ));

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineCheckCircle className="w-5 h-5 mr-2" />
              Go to Home
            </button>
            <h1 className="text-5xl font-bold text-gray-900">Order Status</h1>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6">
          <section className="w-full pl-8">
            <div className="p-8 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <ul>
                <motion.li
                  key="payment-success"
                  className="flex items-center mb-4 text-green-600"
                  initial={{ opacity: 0, y: 20 }} // Fade-in animation
                  animate={{ opacity: 1, y: 0 }} // Appears in normal position
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }} // Hover effect
                >
                  <AiOutlineCheckCircle className="w-5 h-5" />
                  <span className="ml-2 text-xl">Payment Successful</span>
                </motion.li>
                {renderSteps}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
