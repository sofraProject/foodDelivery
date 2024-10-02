import axios from "axios";
import LocationPrompt from "../LocationPrompt";
import React, { useState, useCallback } from "react";
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
} from "react-icons/fa";
import debounce from "lodash/debounce";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const Banner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a valid search term.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${serverDomain}/restaurant/search`, {
        params: { searchTerm },
      });
      setSearchResults(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching search results:", error);
    }
  }, [searchTerm]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.trim()) {
        handleSearch();
      }
    }, 500),
    [handleSearch]
  );

  return (
    <section className="relative flex items-center justify-center w-full mt-16 h-[32rem] bg-[#BFF38A]">
      <div className="absolute inset-0 bg-[#BFF38A]"></div>

      {/* Animated food icons */}
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
          Satisfy Your Cravings in Minutes!
        </h1>
        <p className="mb-8 text-xl text-black md:text-2xl drop-shadow-md">
          Find your favorite meals and fast food delights now 🍔🍕🌭
        </p>

        <div className="max-w-xl mx-auto">
          {showSearch ? (
            <div className="flex items-center p-2 transition-transform bg-white rounded-full shadow-md transform-gpu hover:scale-105">
              <input
                type="text"
                className="flex-grow px-6 py-3 transition duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                placeholder="What would you love to eat today?"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="p-3 transition duration-300 rounded-full shadow-md text-primary bg-dark hover:bg-primary-dark focus:outline-none"
                onClick={handleSearch}
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
        </div>

        {/* Render search results */}
        {searchResults.length > 0 && (
          <ul className="mt-4 text-left">
            {searchResults.map((restaurant) => (
              <li key={restaurant.id} className="p-2 bg-white border-b">
                {restaurant.name}
              </li>
            ))}
          </ul>
        )}

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </section>
  );
};

export default Banner;
