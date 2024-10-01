"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import swal from "sweetalert";
import successImage from "../../../assets/succes.svg"; // Image de succès pour améliorer le design
type ButtonList = string | boolean | false; // Ajouter 'false' dans le type

const PaymentSuccess: React.FC = () => {
  const router = useRouter();

  // Extraire orderId et payment_id de l'URL
  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!orderId || !paymentId) {
      swal({
        title: "Invalid parameters",
        text: "Order ID or Payment ID is missing, redirecting to home...",
        icon: "warning",
        buttons: undefined, // Remplacer 'false' par 'undefined'
        timer: 3000,
      }).then(() => {
        router.push("/");
      });
    }
  }, [orderId, paymentId, router]);

  return (
    <div className="min-h-screen pb-20 mt-24 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            {/* <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button> */}

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
                  src={successImage.src} // Utilisation d'une image pour symboliser le succès
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
