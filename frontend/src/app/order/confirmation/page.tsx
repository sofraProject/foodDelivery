"use client";

import { authHelper } from "@/helpers/authHelper";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import swal from "sweetalert";
import { removeItemsByRestaurantId } from "../../../redux/features/cartSlice";
import DeliveryMap from "./DeliveryMap"; // Importez le composant de la carte

const { getUserId } = authHelper;
const userId = getUserId();
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

type Location = {
  id: number;
  locationName: string;
  lat: number;
  long: number;
};

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const dispatch = useDispatch();
  const [orderStatus, setOrderStatus] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [driverPosition, setDriverPosition] = useState({ lat: 0, long: 0 });
  const [userPosition, setUserPosition] = useState({ lat: 0, long: 0 });
  const socketRef = useRef<any>(null);

  const updateOrderStatus = (status: number) => setOrderStatus(status);

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  const openLocationSelector = (availableLocations: Location[]) => {
    const locationOptions = availableLocations.map(
      (location) =>
        `<option value="${location.id}">${
          location.locationName || `Location ${location.id}`
        }</option>`
    );

    swal({
      title: "Choisissez votre emplacement",
      content: {
        element: "select",
        attributes: {
          innerHTML: locationOptions.join(""),
          className: "swal-select",
        },
      },
      buttons: {
        confirm: {
          text: "Sélectionner l'emplacement",
          value: true,
          visible: true,
          className: "bg-primary text-dark rounded-xl px-6 py-4",
          closeModal: true,
        },
      },
    }).then((selectedValue) => {
      const selectedLocation = availableLocations.find(
        (loc) => loc.id === Number(selectedValue)
      );
      if (selectedLocation) {
        setUserPosition({
          lat: selectedLocation.lat,
          long: selectedLocation.long,
        });
        sendLocationToDriver(selectedLocation);
      }
    });
  };

  const sendLocationToDriver = (location: Location) => {
    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(serverDomain);
    }

    socketRef.current.emit("sendLocationToDriver", {
      locationId: location.id,
      locationName: location.locationName,
      orderId: orderId,
      lat: location.lat,
      long: location.long,
    });

    socketRef.current.on("locationReceived", (data: { orderId: number }) => {
      if (data.orderId === Number(orderId)) {
        swal("Succès", "Emplacement envoyé au chauffeur !", "success");
      }
    });
  };

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await axios.get(
          `${serverDomain}/api/locations/user/${userId}`
        );
        const userLocations = response.data;
        if (userLocations.length === 0) {
          router.push("/saveLocation");
        } else {
          setLocations(userLocations);
          openLocationSelector(userLocations);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des emplacements :",
          error
        );
        router.push("/saveLocation");
      }
    };

    fetchUserLocations();
  }, [router]);

  useEffect(() => {
    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    if (orderId) {
      socketRef.current = io(serverDomain);

      axios
        .put(`${serverDomain}/api/orders/${orderId}/success`)
        .then((response) => {
          const restaurantId = response.data.order.restaurantId;
          dispatch(removeItemsByRestaurantId(restaurantId));
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de la commande", error);
        });

      socketRef.current.on(
        "orderPaymentConfirmed",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) updateOrderStatus(1);
        }
      );

      socketRef.current.on(
        "orderPreparationStarted",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) updateOrderStatus(2);
        }
      );

      socketRef.current.on(
        "orderStatusUpdated",
        (data: { orderId: number }) => {
          if (data.orderId === Number(orderId)) updateOrderStatus(3);
        }
      );

      socketRef.current.on("deliveryConfirmed", (data: { orderId: number }) => {
        if (data.orderId === Number(orderId)) updateOrderStatus(4);
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
  }, [orderId, dispatch]);

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
          <div>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineCheckCircle className="w-5 h-5 mr-2" />
              Accueil
            </button>
            <h1 className="text-5xl font-bold text-gray-900">
              Statut de la commande
            </h1>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <AiOutlineCheckCircle className="w-5 h-5" />
                  <span className="ml-2 text-xl">Paiement réussi</span>
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

      {/* Utilisez le composant DeliveryMap dans la modale */}
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
          {/* Dialog.Panel avec une largeur et hauteur maximales */}
          <Dialog.Panel className="flex flex-col w-full max-w-4xl h-[85vh] bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Titre */}
            <div className="p-6 border-b">
              <Dialog.Title className="text-2xl font-bold text-center text-gray-800">
                Carte de livraison
              </Dialog.Title>
            </div>

            {/* La carte occupe tout l'espace disponible */}
            <div className="flex-grow h-full">
              <DeliveryMap
                userPosition={userPosition}
                driverPosition={driverPosition}
              />
            </div>

            {/* Bouton centré */}
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

export default PaymentSuccess;
