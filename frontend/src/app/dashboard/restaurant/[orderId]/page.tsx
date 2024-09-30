// src/app/dashboard/restaurant/[ownerId]/page.tsx
"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "http://localhost:3000";

const RestaurantManagementPage = ({ params }) => {
  const { ownerId } = params; // Accessing ownerId from params

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!ownerId) {
        console.error("Owner ID is not defined.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${serverDomain}/api/restaurants/${ownerId}`);
        setRestaurant(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setLoading(false);
      } catch (err) {
        setError("Error fetching restaurant.");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [ownerId]);

  const handleUpdateRestaurant = async () => {
    if (!restaurant) return;

    try {
      await axios.put(`${serverDomain}/api/restaurants/${ownerId}`, {
        name,
        description,
      });
      setRestaurant({ ...restaurant, name, description });
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error updating restaurant. Please try again.");
      console.error("Error updating restaurant", err);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!restaurant) return;

    try {
      await axios.delete(`${serverDomain}/api/restaurants/${ownerId}`);
      setRestaurant(null);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error deleting restaurant", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading restaurant...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">Manage Restaurant</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          {restaurant ? (
            <>
              <h2 className="mb-6 text-3xl font-bold">{restaurant.name}</h2>
              {updateError && <p className="text-red-500">{updateError}</p>}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Restaurant Name"
                className="mt-2 p-2 border rounded w-full"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Restaurant Description"
                className="mt-2 p-2 border rounded w-full"
              />
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleUpdateRestaurant}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={handleDeleteRestaurant}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p>No restaurant found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default RestaurantManagementPage;
