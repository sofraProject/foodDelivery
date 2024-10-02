"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import io from "socket.io-client";
import swal from "sweetalert"; // SweetAlert import
import DeliveryMap from "../DeliveryMap"; // Import map component

const OrderTracking = () => {
  const router = useRouter();
  const { orderId } = useParams(); // Extract the orderId from the dynamic route
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  // Set initial positions for both the user and driver in Tunis
  const [orderStatus, setOrderStatus] = useState(3);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [driverPosition, setDriverPosition] = useState({
    lat: 36.8005, // Driver starting position in Tunis
    long: 10.19,
  });
  const [userPosition, setUserPosition] = useState({
    lat: 36.8065, // User position in central Tunis
    long: 10.1815,
  });
  const socketRef = useRef<any>(null);
  const [popupShown, setPopupShown] = useState(false); // To track if the popup is shown already

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

      // Simulate driver location updates for demonstration (move driver towards user)
      const simulateDriverMovement = () => {
        let progress = 0;
        const duration = 20000; // 20 seconds for the driver to reach the user
        const interval = 500; // Update position every 500ms
        const stepLat =
          (userPosition.lat - driverPosition.lat) / (duration / interval);
        const stepLong =
          (userPosition.long - driverPosition.long) / (duration / interval);

        const intervalId = setInterval(() => {
          progress += interval;
          setDriverPosition((prev) => {
            const newLat = prev.lat + stepLat;
            const newLong = prev.long + stepLong;

            // Check if the driver has arrived at the user position
            if (
              Math.abs(newLat - userPosition.lat) < 0.0001 &&
              Math.abs(newLong - userPosition.long) < 0.0001 &&
              !popupShown
            ) {
              clearInterval(intervalId);
              // Show SweetAlert when driver arrives
              swal({
                title: "Driver Arrived!",
                text: "The driver has arrived at your location.",
                icon: "success",
                buttons: {
                  confirm: {
                    text: "OK",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true,
                  },
                },
              });
              setPopupShown(true); // Ensure the popup is only shown once
            }

            return { lat: newLat, long: newLong };
          });

          if (progress >= duration) {
            clearInterval(intervalId);
          }
        }, interval);
      };

      // Start simulating driver movement as soon as the component is mounted
      simulateDriverMovement();

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
  }, [orderId, serverDomain, userPosition, popupShown]);

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

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
        text: "The restaurant is preparing your order...",
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
          <h1 className="text-5xl font-bold text-gray-900">Order Tracking</h1>
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
                    View Delivery Map
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
                Delivery Map
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
                Close Map
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderTracking;
