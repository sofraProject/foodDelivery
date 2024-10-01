"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import successImage from "../../../assets/succes.svg"; // Success image for improved design
import { removeItemsByRestaurantId } from "../../../redux/features/cartSlice"; // Import the action
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Redux dispatch

  // Extract orderId, paymentId, and restaurantId from URL
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("payment_id");
  const restaurantId = searchParams.get("restaurantId"); // Assuming restaurantId is passed

  useEffect(() => {
    if (!orderId || !paymentId) {
      swal({
        title: "Invalid parameters",
        text: "Order ID or Payment ID is missing, redirecting to home...",
        icon: "warning",
        buttons: undefined, // Replace 'false' with 'undefined'
        timer: 3000,
      }).then(() => {
        router.push("/");
      });
    } else {
      // Update order success status
      axios
        .put(`${serverDomain}/api/orders/${orderId}/success`)
        .then((response) => {
          const restaurantId = response.data.order.restaurantId;
          dispatch(removeItemsByRestaurantId(restaurantId));
        })
        .catch((error) => {
          console.error("Error while updating the order", error);
        });

      // Update payment method
      const updatePaymentMethod = async () => {
        try {
          const response = await axios.put(
            `${serverDomain}/api/payment/update-payment-method`,
            {
              orderId,
              paymentMethod: `flouci - pay infos : ${paymentId}`,
            }
          );

          console.log("API Response:", response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      // Call the function to update payment method
      updatePaymentMethod();
    }
  }, [orderId, paymentId, restaurantId, router, dispatch]);

  return (
    <div className="min-h-screen pb-20 mt-24 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Payment Successful
            </h1>
            <p className="text-xl text-gray-500">
              Your payment has been confirmed.
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6 space-x-6">
          <section className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Payment Details
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
              {orderId && (
                <p className="mt-4 text-lg text-gray-600">
                  <strong>Order ID:</strong> {orderId}
                </p>
              )}
              {paymentId && (
                <p className="mt-2 text-lg text-gray-600">
                  <strong>Payment ID:</strong> {paymentId}
                </p>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <button
                onClick={() => router.push(`/order/track/${orderId}`)}
                className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Track Your Order
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 text-lg font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
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

export default PaymentSuccess;
