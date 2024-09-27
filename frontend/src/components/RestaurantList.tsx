"use client";

import React, { useEffect, useRef, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  email: string;
  imagesUrl: string;
  location: string;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;
  const fetchRestaurants = async () => {
    try {
      console.log(
        "sentd okkkkk",
        `${serverDomain}/api/users/owner/restaurants`
      );
      const response = await fetch(
        `${serverDomain}/api/users/`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else {
        setError("Received invalid data format");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="max-w-screen-xl px-6 mx-auto my-12">
      {/* Restaurant Header */}
      <div className="flex flex-col items-center justify-between mb-12 lg:flex-row">
        <div className="lg:w-2/3">
          <h1 className="mb-4 text-4xl font-bold">
            Welcome to Our Partner Restaurants
          </h1>
          <p className="text-lg text-gray-700">
            We partner with leading restaurants to offer you a variety of
            delicious dishes. Check out our partner restaurants and enjoy meals
            made from the freshest ingredients.
          </p>
        </div>
        <img
          src="https://th.bing.com/th/id/OIP.LAKlyp7D03xGufDu_LE6mAHaE8?rs=1&pid=ImgDetMain"
          alt="Restaurant"
          className="object-cover w-full h-64 rounded-lg shadow-lg lg:w-1/3"
        />
      </div>
      {/* Restaurants List with Scrollable Feature */}
      <h2 className="mb-6 text-2xl font-semibold">Our Partners</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-2 transform -translate-y-1/2 bg-gray-100 rounded-full shadow-md top-1/2 hover:bg-gray-200"
        >
          &larr;
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex p-2 space-x-6 overflow-x-scroll scroll-smooth"
        >
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white shadow-md rounded-lg overflow-hidden min-w-[250px] flex-shrink-0 transition-all duration-300 hover:shadow-lg hover:scale-102 cursor-pointer"
            >
              <img
                src={restaurant.imagesUrl}
                alt={restaurant.name}
                className="object-cover w-full h-32"
              />
              <div className="p-4">
                <h3 className="mb-1 text-sm font-semibold text-gray-800 truncate">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-600">{restaurant.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-2 transform -translate-y-1/2 bg-gray-100 rounded-full shadow-md top-1/2 hover:bg-gray-200"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
};

export default RestaurantList;
