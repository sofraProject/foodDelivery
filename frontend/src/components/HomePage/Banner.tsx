"use client";

import { debounce } from "lodash"; // Utilisation de lodash pour la gestion du debounce
import React, { useCallback, useEffect, useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
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

  // Fonction optimisée avec debounce pour éviter les requêtes trop fréquentes
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
    setError(""); // Reset error
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      setError("Please enter a valid search term.");
    }
  }, [searchTerm, debouncedSearch]);

  return (
    <section className="relative flex items-center justify-center w-full mt-16 h-[32rem] bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>
      <div className="container relative z-10 px-4 mx-auto text-center">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-lg">
          Delicious Food, Delivered to You
        </h1>
        <p className="mb-8 text-xl text-white md:text-2xl drop-shadow-md">
          Discover the best restaurants in your area
        </p>
        <div className="max-w-xl mx-auto">
          {showSearch ? (
            <div className="flex items-center p-2 transition-transform bg-white rounded-full shadow-md transform-gpu hover:scale-105">
              <input
                type="text"
                className="flex-grow px-6 py-3 text-gray-800 transition duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="Search for food or restaurants..."
                value={searchTerm}
                aria-label="Search for food or restaurants"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="p-3 text-white transition duration-300 rounded-full shadow-md bg-primary hover:bg-primary-dark focus:outline-none"
                onClick={handleSearch}
                aria-label="Search"
              >
                {isLoading ? (
                  <FaSpinner className="text-xl animate-spin" />
                ) : (
                  <FaSearch className="text-xl" />
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
