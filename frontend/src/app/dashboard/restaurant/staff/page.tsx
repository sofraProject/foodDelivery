"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const DriverManagement = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/driver/`);
        setDrivers(response.data);
      } catch (error) {
        setError("Error fetching drivers.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleUpdateDriverLocation = async () => {
    if (!selectedDriver || !lat || !long) return;

    setIsUpdating(true);
    try {
      await axios.put(`${serverDomain}/api/driver/location`, {
        driverId: selectedDriver.id,
        lat,
        long,
      });

      // Update the driver's location in local state
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === selectedDriver.id
            ? { ...driver, location: { lat, long } }
            : driver
        )
      );

      setUpdateError(null);
      setLat("");
      setLong("");
      setSelectedDriver(null);
    } catch (error) {
      setUpdateError("Error updating driver's location. Please try again.");
      console.error("Error updating location", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      await axios.delete(`${serverDomain}/api/driver/${driverId}`);
      setDrivers((prev) => prev.filter((driver) => driver.id !== driverId));
    } catch (error) {
      console.error("Error deleting driver", error);
    }
  };

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setLat(driver.location?.lat || "");
    setLong(driver.location?.long || "");
    setUpdateError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading drivers...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">Manage Drivers</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Driver List</h2>
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
              >
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() => handleSelectDriver(driver)}
                >
                  <h3 className="text-lg font-semibold">{driver.name}</h3>
                  <p className="text-sm text-gray-500">ID: {driver.id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the onClick of the parent div
                      handleDeleteDriver(driver.id);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSelectDriver(driver)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedDriver && (
            <div className="p-4 bg-white rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold">Update Driver Location</h3>
              {updateError && <p className="text-red-500">{updateError}</p>}
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                className="mt-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                value={long}
                onChange={(e) => setLong(e.target.value)}
                placeholder="Longitude"
                className="mt-2 p-2 border rounded w-full"
              />
              <button
                onClick={handleUpdateDriverLocation}
                disabled={isUpdating}
                className={`mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUpdating ? "Updating..." : "Update Location"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DriverManagement;
