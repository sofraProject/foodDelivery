"use client"; // Ensure this runs on the client side

import axios from "axios";
import Link from "next/link"; // Import Link from Next.js
import React, { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineFileDone,
  AiOutlineFileExclamation,
} from "react-icons/ai";
import swal from "sweetalert";

interface Food {
  id: string;
  name: string;
  price: number;
  category_Id: string;
  imageUrl: string;
  available: boolean;
}

interface MenuItem {
  id: string;
}

const ManageProductScreen: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [dep, setDep] = useState(false);

  // Fetching data on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/menu-items/owner/restaurant`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "An error occurred");
        setLoading(false);
      });
  }, [dep]);

  const handleUpdateAvailable = async (item: MenuItem) => {
    try {
      const response = await axios.patch(
        `/api/menu-items/${item.id}/availability`
      );
      if (response.status === 200) {
        swal("Success!", "Availability updated successfully!", "success");
        setFoods((prevFoods) =>
          prevFoods.map((food) =>
            food.id === item.id
              ? { ...food, available: response.data.newAvailability }
              : food
          )
        );
        setDep(!dep);
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      swal("Error", "Failed to update availability", "error");
    }
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/path/to/fallback/image.jpg";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foods.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex items-center justify-center w-11/12 p-8">
        <div className="w-full p-8 bg-white rounded-lg shadow-md max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold">Manage Products</h1>
          <div className="my-8">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <table className="min-w-full">
                    <thead className="text-white bg-teal-500 poppins">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase"
                        >
                          Image
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-sm font-medium tracking-wider text-left uppercase"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => {
                        const key = item.id
                          ? `food-${item.id}`
                          : `food-${index}`;
                        return (
                          <tr className="bg-white border-b poppins" key={key}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              <img
                                className="object-cover w-20 h-20 rounded"
                                src={item.imageUrl}
                                alt={item.name}
                                onError={handleImageError}
                              />
                            </td>
                            <td className="px-6 py-4 text-base text-gray-900 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-base text-gray-900 whitespace-nowrap">
                              {item.price} TND
                            </td>
                            <td className="px-6 py-4 text-base text-gray-900 whitespace-nowrap">
                              {item.category_Id}
                            </td>
                            <td className="flex px-6 py-4 space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => handleUpdateAvailable(item)}
                                className={`px-4 py-2 rounded text-base ${
                                  item.available
                                    ? "bg-red-500 text-white"
                                    : "bg-green-500 text-white"
                                }`}
                              >
                                {item.available ? (
                                  <AiOutlineFileExclamation size={20} />
                                ) : (
                                  <AiOutlineFileDone size={20} />
                                )}
                              </button>
                              <Link
                                href={`/dashboard/updateProduct/${item.id}`}
                                className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded"
                              >
                                <AiOutlineEdit size={20} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              {Array.from(
                { length: Math.ceil(foods.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-4 py-2 rounded text-base ${
                      currentPage === i + 1
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProductScreen;
