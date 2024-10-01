"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import io from "socket.io-client";
import DeliveryMap from "../DeliveryMap"; // Import map component
import { Dialog } from "@headlessui/react";
const OrderTracking = () => {
  const router = useRouter();
  const { orderId } = useParams(); // Extract the orderId from the dynamic route
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  const [orderStatus, setOrderStatus] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [driverPosition, setDriverPosition] = useState({ lat: 0, long: 0 });
  const [userPosition, setUserPosition] = useState({ lat: 0, long: 0 });
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    if (orderId) {
      socketRef.current = io(serverDomain);

      socketRef.current.on(
        "orderPaymentConfirmed",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) setOrderStatus(1);
        }
      );

      socketRef.current.on(
        "orderPreparationStarted",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) setOrderStatus(2);
        }
      );

      socketRef.current.on(
        "orderStatusUpdated",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) setOrderStatus(3);
        }
      );

      socketRef.current.on("deliveryConfirmed", (data: { orderId: number }) => {
        if (data.orderId === Number(orderId)) setOrderStatus(4);
      });

      socketRef.current.on(
        "driverLocationUpdate",
        (data: { lat: number; long: number }) => {
          setDriverPosition({ lat: data.lat, long: data.long });
        }
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId, serverDomain]);

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  const steps = useMemo(
    () => [
      {
        text: "En attente de la confirmation du restaurant...",
        loading: orderStatus === 0,
        status: 0,
      },
      {
        text: "Restaurant confirmé !",
        loading: orderStatus === 1,
        status: 1,
      },
      {
        text: "Le restaurant prépare votre commande...",
        loading: orderStatus === 2,
        status: 2,
      },
      {
        text: "En attente de la confirmation de livraison...",
        loading: orderStatus === 3,
        status: 3,
      },
      {
        text: "Livraison confirmée !",
        loading: orderStatus === 4,
        status: 4,
      },
    ],
    [orderStatus]
  );

  const renderIcon = (loading: boolean) =>
    loading ? (
      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
    ) : (
      <AiOutlineCheckCircle className="w-5 h-5" />
    );

  const renderSteps = steps.map((step) => (
    <motion.li
      key={step.status}
      className={`flex items-center ${
        orderStatus >= step.status ? "text-green-600" : "text-gray-600"
      } mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      {renderIcon(step.loading)}
      <span className="ml-2 text-xl">{step.text}</span>
    </motion.li>
  ));

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <h1 className="text-5xl font-bold text-gray-900">
            Suivi de la commande
          </h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6">
          <section className="w-full pl-8">
            <div className="p-8 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <ul>
                <motion.li
                  key={"x"}
                  className={`flex items-center text-green-600  mb-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {renderIcon(false)}
                  <span className="ml-2 text-xl"> Payment Successful</span>
                </motion.li>
                {renderSteps}
              </ul>

              {orderStatus >= 3 && (
                <div className="mt-6">
                  <button
                    onClick={openMapModal}
                    className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Voir la carte de livraison
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Dialog
        open={isMapOpen}
        onClose={closeMapModal}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="flex flex-col w-full max-w-4xl h-[85vh] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <Dialog.Title className="text-2xl font-bold text-center text-gray-800">
                Carte de livraison
              </Dialog.Title>
            </div>
            <div className="flex-grow h-full">
              <DeliveryMap
                userPosition={userPosition}
                driverPosition={driverPosition}
              />
            </div>
            <div className="p-4 border-t">
              <button
                onClick={closeMapModal}
                className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Fermer la carte
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderTracking;
