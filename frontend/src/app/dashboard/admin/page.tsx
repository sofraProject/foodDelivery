"use client";

import { useRouter } from "next/navigation";
import {
  AiOutlineShoppingCart,
  AiOutlineDollar,
  AiOutlineShop,
  AiOutlineMenu,
  AiOutlineCalendar,
  AiOutlineUsergroupAdd,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai";

const dashboardCards = [
  {
    title: "Manage Orders",
    description: "View and manage all orders",
    icon: AiOutlineShoppingCart,
    path: "./admin/manageOrders",
    color: "text-red-500",
  },
  {
    title: "Manage Restaurant",
    description: "Edit and update restaurant details",
    icon: AiOutlineShop,
    path: "./admin/manageRestaurant",
    color: "text-yellow-500",
  },
  {
    title: "Manage Drivers",
    description: "Manage restaurant drivers",
    icon: AiOutlineUsergroupAdd,
    path: "./admin/manageDrivers",
    color: "text-teal-500",
  },
];

const Dashboard = () => {
  const router = useRouter();

  // Function to handle navigation
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen py-10 mt-24 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="p-6 transition-all bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
              onClick={() => navigateTo(card.path)}
            >
              <div className="flex items-center">
                <card.icon className={`w-10 h-10 ${card.color} mr-4`} />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;