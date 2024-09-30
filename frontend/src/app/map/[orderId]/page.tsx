"use client";
import axios from "axios";
import { useParams } from "next/navigation"; // Use useParams to access dynamic route params
import React, { useCallback, useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";
import CustomerMapContainer from "../customer/page"; // Ensure correct import path
import DriverMapContainer from "../driver/page"; // Ensure correct import path

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "";

interface Location {
  type: string;
  coordinates: [number, number];
}

interface Driver {
  name: string;
  email: string;
}

interface Order {
  status: string;
}

interface DeliveryStatus {
  id: number;
  status: string;
  current_location: Location;
  driver: Driver;
  Order: Order;
  client_location: Location;
}

const DeliveryTracking: React.FC = () => {
  const { orderId } = useParams(); // Get orderId from the route parameters
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(
    null
  );
  const [userRole, setUserRole] = useState<"customer" | "driver">("customer"); // Role could be based on authentication
  const socket = useSocket(serverDomain);

  // Fetch delivery status from the backend
  const fetchDeliveryStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      // Fetch delivery status from your Express backend
      const response = await axios.get(
        `${serverDomain}/api/delivery/${orderId}`
      );
      setDeliveryStatus(response.data); // Set delivery data in state
    } catch (error) {
      console.error("Error fetching delivery status:", error);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDeliveryStatus(); // Fetch delivery status initially
    const intervalId = setInterval(fetchDeliveryStatus, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchDeliveryStatus]);

  useEffect(() => {
    if (!socket || !orderId) return;

    // Listen for real-time location updates via socket
    const event = `deliveryUpdate-${orderId}`;
    const handleLocationUpdate = (data: {
      latitude: number;
      longitude: number;
    }) => {
      setDeliveryStatus((prevStatus) => {
        if (prevStatus) {
          return {
            ...prevStatus,
            current_location: {
              type: "Point",
              coordinates: [data.longitude, data.latitude],
            },
          };
        }
        return prevStatus;
      });
    };

    socket.on(event, handleLocationUpdate);

    return () => {
      socket.off(event, handleLocationUpdate);
      socket.disconnect();
    };
  }, [orderId, socket]);

  if (!deliveryStatus) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 text-white bg-primary">
          <h1 className="text-3xl font-bold">Delivery Tracking</h1>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <p className="text-gray-600">Order ID:</p>
              <p className="text-xl font-semibold">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-600">Status:</p>
              <p className="text-xl font-semibold">
                {deliveryStatus.Order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Driver:</p>
              <p className="text-xl font-semibold">
                {deliveryStatus.driver.name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Driver Email:</p>
              <p className="text-xl font-semibold">
                {deliveryStatus.driver.email}
              </p>
            </div>
          </div>

          {/* Render the appropriate map container based on the user's role */}
          {userRole === "customer" ? (
            <CustomerMapContainer
              orderId={orderId as string}
              currentLocation={deliveryStatus.current_location}
              clientLocation={deliveryStatus.client_location}
              orderStatus={deliveryStatus.Order.status}
            />
          ) : (
            <DriverMapContainer
              orderId={orderId as string}
              currentLocation={deliveryStatus.current_location}
              clientLocation={deliveryStatus.client_location}
              orderStatus={deliveryStatus.Order.status}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
