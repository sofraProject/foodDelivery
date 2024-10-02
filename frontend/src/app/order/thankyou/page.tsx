"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import successImage from "../../../assets/succes.svg"; // Success image for improved design
import { removeItemsByRestaurantId } from "../../../redux/features/cartSlice"; // Import the action
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const OrderComplete: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Redux dispatch

  // Extract orderId and restaurantId from URL
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");
  const restaurantId = searchParams.get("restaurantId"); // Assuming restaurantId is passed

  useEffect(() => {
    // Update order completion status
    axios
      .put(`${serverDomain}/api/orders/${orderId}/completed`)
      .then((response) => {
        const restaurantId = response.data.order.restaurantId;
        dispatch(removeItemsByRestaurantId(restaurantId)); // Clear cart for this restaurant
      })
      .catch((error) => {
        console.error("Error while updating the order", error);
      });
  }, [orderId, restaurantId, router, dispatch]);

  return (
    <div className="min-h-screen pb-20 mt-24 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Thank You for Your Trust
            </h1>
            <p className="text-xl text-gray-500">
              Your order has been delivered and completed.
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6 space-x-6">
          <section className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Image
                  src={successImage.src}
                  alt="Success"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>

              <p className="mt-4 text-lg text-gray-600">
                <strong>Order ID:</strong>23987 {orderId}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Return to Home
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrderComplete;
