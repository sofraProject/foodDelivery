"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { useDispatch } from "react-redux";
import GridLoader from "react-spinners/GridLoader";
import { clearCart } from "../../redux/features/cartSlice";
import { AppDispatch } from "../../redux/store";

const OrderSuccessfulScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); // Utilisation de useSearchParams pour accéder aux paramètres d'URL

  // Récupération de l'ID de la commande
  const orderId = searchParams.get("orderId");
  console.log("----------", orderId);
  useEffect(() => {
    setLoading(true);
    dispatch(clearCart());
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [dispatch]);

  const handleTrackOrder = () => {
    if (orderId) {
      router.push(`/delivery-tracking/${orderId}`);
    } else {
      console.error("Order ID not found");
    }
  };

  return (
    <main className="h-screen banner">
      <div className="max-w-screen-xl px-6 py-20 mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-24 h-3/4">
            <GridLoader color="#ce193c" loading={loading} size={25} />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center pt-24 h-3/4">
              <h1 className="flex items-center space-x-6 text-3xl font-semibold text-center text-primary poppins ">
                <MdVerified className="text-3xl text-primary green-500" /> Order
                Successful!!!
              </h1>
              <Image
                className="object-contain w-96"
                src="/ordersuccess.png" // Assurez-vous que cette image est placée dans le dossier "public"
                alt="Order Successful"
                width={400}
                height={300}
              />
              <div className="flex flex-col w-full max-w-xs mx-auto mt-8 space-y-4">
                <button
                  className="flex items-center justify-center px-8 py-2 text-white transition duration-300 transform rounded-full bg-primary focus:outline-none poppins hover:scale-105"
                  onClick={() => router.push("/")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Go back to home
                </button>
                {orderId && (
                  <button
                    className="flex items-center justify-center px-8 py-2 text-white transition duration-300 transform bg-orange-500 rounded-full focus:outline-none poppins hover:scale-105"
                    onClick={handleTrackOrder}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Track Order
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OrderSuccessfulScreen;

