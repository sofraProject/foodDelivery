"use client";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Importing arrow icon
import { IoIosAddCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import image from "../../../assets/preview.svg";
import { handleAddToCartHelper } from "../../../helpers/cartHelper"; // Utilisation du helper existant
import { AppDispatch } from "../../../redux/store";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
  categoryId: number;
  restaurantId: number;
}

interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

const RestaurantPage: React.FC = () => {
  const { restaurantName } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter(); // Next.js router hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch restaurant by name
        const restaurantRes = await axios.get(
          `${serverDomain}/api/restaurants/name/${restaurantName}`
        );
        setRestaurant(restaurantRes.data);

        // Fetch menu items for the restaurant
        const menuItemsRes = await axios.get(
          `${serverDomain}/api/menu-items/restaurant/${restaurantRes.data.id}`
        );
        setMenuItems(menuItemsRes.data);

        // Fetch categories
        const categoriesRes = await axios.get(`${serverDomain}/api/categories`);
        setCategories(categoriesRes.data);

        setLoading(false);
      } catch (error) {
        setError("Error fetching restaurant data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantName]);

  // Handle category filtering
  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  // Handle adding the item to the cart using the helper
  const handleAddToCart = (item: MenuItem) => {
    handleAddToCartHelper(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1, // Par défaut, on ajoute 1 article à la fois
        imageUrl: item.imageUrl,
        available: true,
        likes: 0, // À adapter si nécessaire
        restaurantId: item.restaurantId,
      },
      dispatch
    );
  };

  // Handle redirect to the item detail page
  const handleItemClick = (itemId: number) => {
    router.push(`/OneItemDetail/${itemId}`);
  };

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

  // If the restaurant isn't found
  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      {/* Header Section */}
      <header className="w-full bg-white ">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <div>
            {/* Back Button */}
            <button
              onClick={() => router.back()} // Go back to the previous page
              className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <h1 className="text-5xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            <p className="text-xl text-gray-500">
              {restaurant.description || "No description available"}
            </p>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>
              With us since :{" "}
              {new Date(restaurant.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6">
          {/* Sidebar: Categories (1/3 of the width) */}
          <aside className="w-1/5 p-6 bg-white border-r border-gray-200 rounded-lg shadow-md">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Sections</h2>
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

          {/* Menu Items (2/3 of the width) */}
          <section className="w-4/5 pl-8">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              {selectedCategory
                ? `Category: ${
                    categories.find((cat) => cat.id === selectedCategory)?.name
                  }`
                : "All Items"}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col p-4 transition-shadow bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                  onClick={() => handleItemClick(item.id)} // Redirect on click
                >
                  <Image
                    src={item.imageUrl || image} // Use a placeholder image if URL is null
                    alt={item.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-64 mb-4 rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900">
                      {item.price} TND
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the redirect
                        handleAddToCart(item);
                      }}
                      className="flex items-center px-4 py-2 transition-colors rounded-full text-dark bg-primary hover:bg-dark hover:text-primary"
                    >
                      <IoIosAddCircle className="mr-2" /> Add to cart
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

export default RestaurantPage;
