"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import Footer from "../../components/HomePage/Footer/Footer";
import { addToCartAsync } from "../../redux/features/cartSlice";
import { AppDispatch } from "../../redux/store";
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface Food {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  User: {
    id: number;
  };
  availble: number;
  likes: number;
}

const FoodDetailScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [food, setFood] = useState<Food | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const defaultDescription =
    "The texture of food that needs to be chewed thoroughly before swallowing. Can be light and bouncy or heavy and sticky.";

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`${serverDomain}/api/menu-items/${id}`);
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.error("Error fetching food item:", error);
      }
    };
    fetchFood();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = () => {
    if (food) {
      dispatch(
        addToCartAsync({
          id: food.id,
          name: food.name,
          price: food.price,
          quantity: quantity,
          user_id: food.User.id,
          imageUrl: food.imageUrl,
          availble: food.availble,
          likes: food.likes,
        })
      );
      swal(
        "Delicious choice!",
        "Your order has been added to the cart",
        "success"
      );
    }
  };

  if (!food)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-100 to-orange-200">
      <main className="flex items-center justify-center flex-grow px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center mb-8 font-medium text-orange-600 hover:text-orange-800"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Menu
          </button>
          <div className="overflow-hidden bg-white shadow-2xl rounded-3xl">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <img
                  className="object-cover w-full h-96 md:h-full"
                  src={food.imageUrl}
                  alt={food.name}
                />
              </div>
              <div className="p-8 md:w-1/2">
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
                  {food.name}
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                  {food.description || defaultDescription}
                </p>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-bold text-orange-600">
                    {(food.price * quantity).toFixed(2)} TND
                  </span>
                  <div className="flex items-center border-2 border-orange-200 rounded-full">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      aria-label="Decrease quantity"
                    >
                      <AiOutlineMinus className="w-6 h-6" />
                    </button>
                    <span className="px-4 py-2 text-xl font-semibold text-gray-700">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 text-orange-600 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      aria-label="Increase quantity"
                    >
                      <AiOutlinePlus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-in-out transform border border-transparent rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:-translate-y-1"
                >
                  <BsCart2 className="w-6 h-6 mr-3" aria-hidden="true" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodDetailScreen;
