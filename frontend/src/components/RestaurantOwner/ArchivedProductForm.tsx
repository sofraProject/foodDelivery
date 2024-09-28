"use client"; // Ensure this runs on the client side

import axios from "axios";
import Link from "next/link"; // Use Next.js Link component
import React, { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineFileDone,
  AiOutlineFileExclamation,
} from "react-icons/ai"; // Import des icônes
import swal from "sweetalert";
import Heading from "./Heading";

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

const ArchivedProductForm: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [dep, setDep] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/menu-items/owner/archive`, {
        // Adjusted API path for Next.js
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // Filter items to only include those with available set to false
        const archivedFoods = response.data.filter(
          (food: Food) => !food.available
        );
        setFoods(archivedFoods);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "An error occurred");
        setLoading(false);
      });
  }, [dep]);

  const handleUpdateAvailable = async (item: MenuItem) => {
    // Changement de l'orthographe
    try {
      const response = await axios.patch(
        `/api/menu-items/${item.id}/availability`
      );

      if (response.status === 200) {
        swal("Succès !", "Disponibilité mise à jour avec succès !", "success");
        setFoods((prevFoods) =>
          prevFoods.map((food) =>
            food.id === item.id
              ? { ...food, available: response.data.newAvailability }
              : food
          )
        );
        setDep(!dep);
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la disponibilité:",
        error
      );
      swal("Erreur", "Échec de la mise à jour de la disponibilité", "error");
    }
  };

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/path/to/fallback/image.jpg"; // Ensure fallback image is accessible
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foods.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/6 p-4 bg-white">
        {/* Side navigation content goes here */}
      </div>
      <div className="flex items-center justify-center w-3/4 p-8">
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
          <Heading text="Archived Products" />
          <div className="my-8">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <table className="min-w-full">
                    <thead className="bg-teal-500 poppins">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                        >
                          Image
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase"
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
                                className="w-16"
                                src={item.imageUrl}
                                alt={item.name}
                                onError={handleImageError}
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {" "}
                              {item.price} TND
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {item.category_Id}
                            </td>
                            <td className="flex px-6 py-4 space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => handleUpdateAvailable(item)}
                                className={`px-4 py-2 rounded ${
                                  item.available
                                    ? "bg-red-500 text-white"
                                    : "bg-green-500 text-white"
                                }`}
                              >
                                {item.available ? (
                                  <AiOutlineFileExclamation />
                                ) : (
                                  <AiOutlineFileDone />
                                )}
                              </button>
                              <Link
                                href={`/dashboard/updateProduct/${item.id}`} // Updated for Next.js
                                className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded"
                              >
                                <AiOutlineEdit />
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
            <div className="flex justify-center mt-4">
              {Array.from(
                { length: Math.ceil(foods.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-1 rounded ${
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

export default ArchivedProductForm;
