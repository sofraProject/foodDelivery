import axios from "axios";
import React, { useState } from "react";
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
} from "react-icons/fa";
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;
const Banner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
 
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      console.log("Please enter a valid search term.");
      return;
    }

    try {
      const response = await axios.get(`${serverDomain}/api/restaurants/search`, {
        params: { searchTerm },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <section className="relative flex items-center justify-center w-full mt-16 h-[32rem] bg-[#BFF38A]">
      <div className="absolute inset-0 bg-[#BFF38A]"></div>

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
          <a
            href="/saveLocation"
            className="px-6 py-3 text-lg font-bold text-white bg-dark rounded-full hover:bg-primary-dark focus:outline-none"
          >
            Search for food or restaurants
          </a>

          <div className="flex items-center mt-6">
            <input
              type="text"
              className="flex-grow px-6 py-3 text-lg transition duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="What are you craving today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search for food or restaurants"
            />
            <button
              className="p-3 ml-2 transition duration-300 rounded-full shadow-md text-primary bg-dark hover:bg-primary-dark focus:outline-none"
              onClick={handleSearch}
              aria-label="Search"
            >
              <FaSearch className="text-xl text-primary" />
            </button>
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
        </div>
      </div>
    </section>
  );
};

export default Banner;
