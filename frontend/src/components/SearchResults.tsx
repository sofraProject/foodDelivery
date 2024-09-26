"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaStore, FaUtensils } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SearchResults: React.FC = () => {
  const { results, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  const [addresses, setAddresses] = useState<{ [key: string]: string }>({});

  const [menuItemsPage, setMenuItemsPage] = useState(1);
  const [restaurantsPage, setRestaurantsPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (results.restaurants) {
      results.restaurants.forEach((restaurant) => {
        if (
          restaurant.location &&
          Array.isArray(restaurant.location.coordinates)
        ) {
          getAddressFromCoordinates(
            restaurant.location.coordinates[0],
            restaurant.location.coordinates[1]
          ).then((address) => {
            setAddresses((prev) => ({ ...prev, [restaurant.id]: address }));
          });
        }
      });
    }
  }, [results.restaurants]);

  const getAddressFromCoordinates = async (lng: number, lat: number) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      return response.data.features[0].place_name;
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not available";
    }
  };

  if (loading)
    return <div className="py-8 text-2xl text-center">Loading...</div>;
  if (error)
    return (
      <div className="py-8 text-2xl text-center text-red-500">
        Error: {error}
      </div>
    );

  const hasMenuItems = results.menuItems && results.menuItems.length > 0;
  const hasRestaurants = results.restaurants && results.restaurants.length > 0;

  const paginate = (items: any[], page: number) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="container px-4 py-12 mx-auto bg-gray-100">
      <h2 className="mb-8 text-4xl font-bold text-center text-gray-800">
        Search Results
      </h2>
      {!hasMenuItems && !hasRestaurants && (
        <p className="text-xl text-center text-gray-600">
          No results found. Try a different search term.
        </p>
      )}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {hasMenuItems && (
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="flex items-center mb-4 text-2xl font-semibold text-orange-600">
              <FaUtensils className="mr-2" /> Menu Items
            </h3>
            <ul className="space-y-4">
              {paginate(results.menuItems, menuItemsPage).map((item) => (
                <li
                  key={item.id}
                  className="pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <Link
                    href={`/OneItemdetail/${item.id}`}
                    className="flex items-center p-2 transition duration-300 rounded-lg hover:bg-orange-50"
                  >
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="object-cover w-20 h-20 mr-4 rounded-lg"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">
                        {item.name}
                      </h4>
                      <p className="font-bold text-orange-600">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.User?.name || "Unknown Restaurant"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  setMenuItemsPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={menuItemsPage === 1}
                className="px-4 py-2 mx-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setMenuItemsPage((prev) => prev + 1)}
                disabled={
                  menuItemsPage * itemsPerPage >= results.menuItems.length
                }
                className="px-4 py-2 mx-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {hasRestaurants && (
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="flex items-center mb-4 text-2xl font-semibold text-green-600">
              <FaStore className="mr-2" /> Restaurants
            </h3>
            <ul className="space-y-4">
              {paginate(results.restaurants, restaurantsPage).map(
                (restaurant) => (
                  <li
                    key={restaurant.id}
                    className="pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center p-2 transition duration-300 rounded-lg hover:bg-green-50">
                      <img
                        src={
                          restaurant.imagesUrl ||
                          "https://via.placeholder.com/100"
                        }
                        alt={restaurant.name}
                        className="object-cover w-20 h-20 mr-4 rounded-lg"
                      />
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">
                          {restaurant.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {restaurant.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {addresses[restaurant.id] || "Fetching address..."}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
            <div className="flex justify-center mt-4">
              <button
                onClick={() =>
                  setRestaurantsPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={restaurantsPage === 1}
                className="px-4 py-2 mx-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setRestaurantsPage((prev) => prev + 1)}
                disabled={
                  restaurantsPage * itemsPerPage >= results.restaurants.length
                }
                className="px-4 py-2 mx-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
