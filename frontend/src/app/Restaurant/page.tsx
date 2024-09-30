"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import swal from "sweetalert";
import image from "../../assets/preview.svg"; // Placeholder image

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

export interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  menuItems: MenuItem[]; // Include menu items in restaurant interface
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  categoryId: number;
  restaurantId: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
}

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all restaurants with their menu items and categories
        const restaurantsRes = await axios.get(
          `${serverDomain}/api/restaurants/category`
        );
        setRestaurants(restaurantsRes.data);

        // Fetch categories
        const categoriesRes = await axios.get(`${serverDomain}/api/categories`);
        setCategories(categoriesRes.data);

        setLoading(false);
      } catch (error) {
        setError("Error fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category filtering
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // Filter restaurants by selected category (if selectedCategory is not null)
  const filteredRestaurants = selectedCategory
    ? restaurants.filter(
        (restaurant) =>
          Array.isArray(restaurant.menuItems) &&
          restaurant.menuItems.some(
            (item) => item.categoryId === selectedCategory
          )
      )
    : restaurants;

  // UX Improvements: Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // Error Handling: Show error message if data fetching fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      {/* Header Section */}
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            <button
              onClick={() => router.back()} // Go back to the previous page
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-5xl font-bold text-gray-900">Restaurants</h1>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6">
          {/* Sidebar: Categories */}
          <aside className="w-1/5 p-6 bg-white border-r border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Categories</h2>
            <ul className="space-y-4">
              <li
                className={`cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition ${
                  !selectedCategory ? "font-bold text-primary" : ""
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                Afficher tout
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition ${
                    selectedCategory === category.id
                      ? "font-bold text-primary"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Restaurant Items */}
          <section className="w-4/5 pl-8">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {selectedCategory
                ? `Category: ${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  }`
                : "All Restaurants"}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex flex-col p-4 transition-shadow bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                >
                  <Image
                    src={image} // Placeholder for restaurant image
                    alt={restaurant.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-64 mb-4 rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {restaurant.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">
                      Added on:{" "}
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      className="px-4 py-2 transition-colors rounded-full text-dark bg-primary hover:bg-dark hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent redirect trigger
                        swal(
                          "Restaurant selected",
                          `You selected ${restaurant.name}`,
                          "success"
                        );
                      }}
                    >
                      <IoIosAddCircle className="mr-2" /> Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantsPage;
