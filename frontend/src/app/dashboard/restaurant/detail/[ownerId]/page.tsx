"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use this for accessing params in Next.js

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const RestaurantManagementPage = () => {
  const { ownerId } = useParams(); // Accessing ownerId from params

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!ownerId) {
        console.error("Owner ID is not defined.");
        setError("Owner ID is not defined.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${serverDomain}/api/restaurants/${ownerId}`);
        if (response.status === 200) {
          setRestaurant(response.data);
          setName(response.data.name);
          setDescription(response.data.description);
        } else {
          throw new Error("Restaurant not found.");
        }
      } catch (err) {
        setError(err.response ? err.response.data : "Error fetching restaurant.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [ownerId]);

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!restaurant) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile); // Append the image file if it exists
    }

    try {
      const response = await axios.put(`${serverDomain}/api/restaurants/${ownerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRestaurant({ ...restaurant, name, description, imageUrl: response.data.restaurant.imageUrl });
      setSuccessMessage("Restaurant updated successfully!");
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error updating restaurant. Please try again.");
      console.error("Error updating restaurant", err);
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
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              <form onSubmit={handleUpdateRestaurant}>
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="mt-2 p-2 border rounded w-full"
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
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
