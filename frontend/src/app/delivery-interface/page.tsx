"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import io from "socket.io-client";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface DeliveryUpdateData {
  deliveryId: number;
  location: { lat: number; lng: number }; // Adjust the location type based on your implementation
}

const DeliveryManagementPage = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/deliveries`);
        setDeliveries(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching deliveries.");
        setLoading(false);
      }
    };

    fetchDeliveries();

    if (!serverDomain) {
      console.error("Server domain is not defined");
      return;
    }

    const socket = io(serverDomain);

    // Listen for delivery updates
    socket.on("deliveryUpdate", (data: DeliveryUpdateData) => {
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === data.deliveryId
            ? { ...delivery, location: data.location }
            : delivery
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading deliveries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <h1 className="text-5xl font-bold text-gray-900">
            Manage Deliveries
          </h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Deliveries</h2>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {deliveries.map((delivery) => (
              <Marker
                key={delivery.id}
                position={[delivery.location.lat, delivery.location.lng]}
              >
                <Popup>
                  <div>
                    <h3>{`Delivery ID: ${delivery.id}`}</h3>
                    <p>{`Status: ${delivery.status}`}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>
    </div>
  );
};

export default DeliveryManagementPage;
