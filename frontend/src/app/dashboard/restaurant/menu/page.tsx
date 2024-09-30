"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { MenuItem, Category, Restaurant } from "@/app/Restaurant/page";

const serverDomain =
  process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000"; // Provide a default value

const MenuItemManagementPage = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/restaurants/category`);
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const [expandedRestaurantId, setExpandedRestaurantId] = useState<number | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const toggleRestaurant = (id: number) => {
    setExpandedRestaurantId(expandedRestaurantId === id ? null : id);
    setExpandedCategoryId(null); // Reset category when changing restaurants
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold cursor-pointer" onClick={() => toggleRestaurant(restaurant.id)}>
                  {restaurant.name}
                </h3>
                {expandedRestaurantId === restaurant.id && (
                  <div className="mt-2">
                    {restaurant.menuItems.length === 0 ? (
                      <p className="text-sm text-gray-500">No categories available.</p>
                    ) : (
                      restaurant.menuItems.map((category) => (
                        <div key={category.id}>
                          <h4 className="mt-2 font-semibold cursor-pointer" onClick={() => toggleCategory(category.id)}>
                            {category.name}
                          </h4>
                          {expandedCategoryId === category.id && (
                            <div className="ml-4">
                              {category.items.map((item) => (
                                <div key={item.id} className="p-2 border-b border-gray-200">
                                  <p className="text-sm">{item.name} - ${item.price}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MenuItemManagementPage;
