import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import DeliveryMap from "../components/DeliveryMap";
import useSocket from "../hooks/useSocket";
import { QrReader } from "react-qr-reader";

const DeliveryInterface: React.FC = () => {
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [deliveryId, setDeliveryId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [clientLocation, setClientLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const socket = useSocket("http://localhost:3000");

  useEffect(() => {
    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const updateDeliveryLocation = useCallback(async () => {
    if (!currentLocation || !orderId) return;

    try {
      await axios.post(
        "http://localhost:3000/api/orders/update-location",
        {
          deliveryId,
          orderId,
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      socket?.emit("updateDeliveryLocation", {
        orderId,
        location: {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        },
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  }, [currentLocation, orderId, deliveryId, socket]);

  useEffect(() => {
    if (currentLocation && orderId) {
      updateDeliveryLocation();
    }
  }, [currentLocation, orderId, updateDeliveryLocation]);

  const updateOrderStatus = async (newStatus: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/orders/delivery/update-status",
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrderStatus(newStatus);
      if (newStatus === "on_the_way") {
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/orders/delivery-status/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrderStatus(response.data.Order.status);
      setClientLocation({
        lat: response.data.client_location.coordinates[1],
        lng: response.data.client_location.coordinates[0],
      });
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Delivery Interface</h1>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter Delivery ID"
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowQrScanner(!showQrScanner)}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 shadow-md"
              >
                {showQrScanner ? "Hide QR Scanner" : "Scan QR Code"}
              </button>
            </div>
            {showQrScanner && (
              <div className="mb-6">
                <QrReader
                  onResult={(result, error) => {
                    if (error) {
                      console.error(error);
                    }
                    if (result) {
                      const data = result.getText();
                      const [scannedDeliveryId, scannedOrderId] =
                        data.split(",");
                      if (scannedDeliveryId && scannedOrderId) {
                        setDeliveryId(scannedDeliveryId.trim());
                        setOrderId(scannedOrderId.trim());
                        setShowQrScanner(false);
                        fetchOrderDetails();
                      } else {
                        console.error("Invalid QR code data");
                      }
                    }
                  }}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => updateOrderStatus("preparing")}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                Start Preparing
              </button>
              <button
                onClick={() => updateOrderStatus("on_the_way")}
                className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              >
                Start Delivery
              </button>
              <button
                onClick={() => updateOrderStatus("delivered")}
                className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              >
                Mark as Delivered
              </button>
            </div>
            {orderStatus === "on_the_way" &&
              currentLocation &&
              clientLocation && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold mb-4">Live Tracking</h2>
                  <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                    <DeliveryMap
                      orderId={orderId}
                      initialDriverLocation={currentLocation}
                      clientLocation={clientLocation}
                      isDriver={true}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInterface;
