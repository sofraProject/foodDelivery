"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import Footer from "../../../components/HomePage/Footer/Footer";
import { handleAddToCartHelper } from "../../../helpers/cartHelper"; // Assurez-vous que le chemin est correct
import { AppDispatch } from "../../../redux/store";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Food {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  description?: string;
  available: boolean;
  likes: number;
  user: User;
  restaurantId: any;
}

const FoodDetailScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { productId } = params;

  const defaultDescription =
    "The texture of food that needs to be chewed thoroughly before swallowing. Can be light and bouncy or heavy and sticky.";

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${serverDomain}/api/menu-items/${productId}`
        );

        if (response.data) {
          setFood(response.data);
        } else {
          setError("Food item not found.");
        }
      } catch (error) {
        setError("Error fetching food item. Please try again later.");
        console.error("Error fetching food item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const handleAddToCart = () => {
    if (food) {
      handleAddToCartHelper(
        {
          id: food.id,
          name: food.name,
          price: parseFloat(food.price),
          quantity: Math.max(1, quantity),
          imageUrl: food.imageUrl,
          available: food.available,
          likes: food.likes,
          restaurantId: food.restaurantId,
        },
        dispatch
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex items-center justify-center flex-grow px-4 py-20 mt-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-1 mb-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="flex p-8 bg-white rounded-lg shadow-md">
            <div className="w-1/2 mr-6">
              <img
                className="object-cover w-full rounded-lg h-96"
                src={food?.imageUrl}
                alt={food?.name}
              />
            </div>
            <div className="flex flex-col justify-between w-1/2">
              <div>
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
                  {food?.name}
                </h1>
                <p className="mb-6 text-lg text-gray-600">
                  {food?.description || defaultDescription}
                </p>
              </div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl font-bold text-primary">
                  {(parseFloat(food?.price || "0") * quantity).toFixed(2)} TND
                </span>
                <div className="flex items-center border-2 rounded-full border-primary">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-full text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="p-2 rounded-full text-primary hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Increase quantity"
                  >
                    <AiOutlinePlus className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center w-full px-8 py-4 text-lg font-semibold text-white transition duration-300 ease-in-out transform border border-transparent rounded-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:-translate-y-1"
              >
                <BsCart2 className="w-6 h-6 mr-3" aria-hidden="true" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodDetailScreen;
