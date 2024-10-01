"use client";

import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaBacon,
  FaCheese,
  FaDrumstickBite,
  FaFish,
  FaHamburger,
  FaHotdog,
  FaIceCream,
  FaPizzaSlice,
  FaSearch,
  FaSpinner,
} from "react-icons/fa"; // Icônes de fast-food
import { useDispatch, useSelector } from "react-redux";
import { searchProductsAndRestaurants } from "../../redux/features/searchSlice";
import { AppDispatch, RootState } from "../../redux/store";
import LocationPrompt from "../LocationPrompt";

const Banner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user && user.location) {
      setShowSearch(true);
    }
  }, [user]);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        dispatch(searchProductsAndRestaurants(searchTerm)).finally(() => {
          setIsLoading(false);
        });
      } else {
        setError("Please enter a valid search term.");
      }
    }, 500),
    []
  );

  const handleSearch = useCallback(() => {
    setError("");
    if (searchTerm.trim() && user?.location) {
      debouncedSearch(searchTerm, user.location);
    } else {
      setError("Please enter a valid search term or location.");
    }
  }, [searchTerm, debouncedSearch, user?.location]);

  return (
    <section className="relative flex items-center justify-center w-full mt-16 h-[32rem] bg-[#BFF38A]">
      {" "}
      {/* Fond en couleur primaire */}
      <div className="absolute inset-0 bg-[#BFF38A]"></div>{" "}
      {/* Couleur primaire #BFF38A */}
      {/* Icônes de fast-food avec animations lentes et couleur noire */}
      <FaPizzaSlice className="absolute top-10 left-4 text-black/50 text-7xl animate-slow-spin" />
      <FaHamburger className="absolute top-16 right-6 text-black/50 text-8xl animate-slow-bounce" />
      <FaIceCream className="absolute bottom-6 left-8 text-black/50 text-7xl animate-slow-ping" />
      <FaHotdog className="absolute text-6xl bottom-8 right-12 text-black/50 animate-slow-pulse" />
      <FaDrumstickBite className="absolute text-6xl bottom-16 left-1/4 text-black/50 animate-slow-pulse" />
      <FaFish className="absolute text-6xl top-1/4 left-20 text-black/50 animate-slow-bounce" />
      <FaBacon className="absolute text-5xl top-1/3 right-24 text-black/50 animate-slow-spin" />
      <FaCheese className="absolute top-1/2 right-1/4 text-black/50 text-7xl animate-slow-ping" />
      <div className="container relative z-10 px-4 mx-auto text-center">
        <h1 className="mb-6 text-4xl font-extrabold text-black md:text-5xl lg:text-6xl drop-shadow-lg">
          Your Fast Food Feast Awaits!
        </h1>
        <p className="mb-8 text-xl text-black md:text-2xl drop-shadow-md">
          Discover the best fast food in town 🍔🍕🌭
        </p>
        <div className="max-w-xl mx-auto">
          {showSearch ? (
            <div className="flex items-center p-2 transition-transform bg-white rounded-full shadow-md transform-gpu hover:scale-105">
              <input
                type="text"
                className="flex-grow px-6 py-3 transition duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="What are you craving today?"
                value={searchTerm}
                aria-label="Search for food or restaurants"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="p-3 transition duration-300 rounded-full shadow-md text-primary bg-dark hover:bg-primary-dark focus:outline-none"
                onClick={handleSearch}
                aria-label="Search"
              >
                {isLoading ? (
                  <FaSpinner className="text-xl animate-spin" />
                ) : (
                  <FaSearch className="text-xl text-primary" />
                )}
              </button>
            </div>
          ) : (
            <LocationPrompt onLocationSet={() => setShowSearch(true)} />
          )}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default Banner;
