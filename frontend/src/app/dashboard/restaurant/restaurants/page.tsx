"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const RestaurantManagementPage = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/restaurants/`);
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching restaurants.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleDeleteRestaurant = async (restaurantId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/restaurants/${restaurantId}`);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
      );
      // Clear selected restaurant if it's deleted
      if (selectedRestaurant?.id === restaurantId) {
        setSelectedRestaurant(null);
        setName("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error deleting restaurant", error);
    }
  };

  const handleUpdateRestaurant = async () => {
    if (!selectedRestaurant) return;

    try {
      await axios.put(`${serverDomain}/api/restaurants/${selectedRestaurant.id}`, {
        name,
        description,
      });

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === selectedRestaurant.id
            ? { ...restaurant, name, description }
            : restaurant
        )
      );

      // Clear selected restaurant and input fields
      setSelectedRestaurant(null);
      setName("");
      setDescription("");
      setUpdateError(null);
    } catch (error) {
      setUpdateError("Error updating restaurant. Please try again.");
      console.error("Error updating restaurant", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading restaurants...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">Manage Restaurants</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Restaurant List</h2>
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setName(restaurant.name);
                  setDescription(restaurant.description);
                  setUpdateError(null); // Reset any update errors when selecting a restaurant
                }}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500">{restaurant.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the onClick of the parent div
                      handleUpdateRestaurant(); // Trigger the update
                    }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the onClick of the parent div
                      handleDeleteRestaurant(restaurant.id);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedRestaurant && (
            <div className="p-4 bg-white rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold">Update Restaurant Details</h3>
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
                  onClick={() => handleDeleteRestaurant(selectedRestaurant.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RestaurantManagementPage;
