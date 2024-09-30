// src/app/dashboard/page.tsx
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

const Dashboard = ({ params }) => {
  const router = useRouter();
  const { ownerId } = params; // Access ownerId directly from params

  const dashboardCards = [
    {
      title: "Manage Orders",
      description: "View and manage all orders",
      icon: AiOutlineShoppingCart,
      path: "/dashboard/restaurant/orders",
      color: "text-red-500",
    },
    {
      title: "Manage Restaurant",
      description: "Edit and update restaurant details",
      icon: AiOutlineShop,
      path: `/dashboard/restaurant/${ownerId}`, // Use ownerId in path
      color: "text-yellow-500",
    },
    {
      title: "Sales",
      description: "View sales performance",
      icon: AiOutlineDollar,
      path: "/sales",
      color: "text-green-500",
    },
    {
      title: "Manage Menu",
      description: "Edit and update the restaurant menu",
      icon: AiOutlineMenu,
      path: "/dashboard/restaurant/menu",
      color: "text-blue-500",
    },
    {
      title: "Reservations",
      description: "Manage table reservations",
      icon: AiOutlineCalendar,
      path: "/reservations",
      color: "text-purple-500",
    },
    {
      title: "Manage Staff",
      description: "Manage restaurant staff members",
      icon: AiOutlineUsergroupAdd,
      path: "/dashboard/restaurant/staff",
      color: "text-teal-500",
    },
    {
      title: "Customer Reviews",
      description: "View and respond to customer reviews",
      icon: AiOutlineStar,
      path: "/reviews",
      color: "text-orange-500",
    },
    {
      title: "Manage Customers",
      description: "View and manage all customers.",
      icon: AiOutlineUser,
      path: "/dashboard/restaurant/customers",
      color: "text-orange-500",
    },
  ];

  const navigateTo = (path) => {
    router.push(path);
  };

  if (!ownerId) {
    return <div className="text-red-500">Owner ID is not defined.</div>;
  }

  return (
    <div className="min-h-screen py-10 mt-24 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">
          Restaurant Owner Dashboard
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
