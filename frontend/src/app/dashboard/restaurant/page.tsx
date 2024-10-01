"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AiOutlineShoppingCart,
  AiOutlineDollar,
  AiOutlineShop,
  AiOutlineMenu,
  AiOutlineCalendar,
  AiOutlineUsergroupAdd,
  AiOutlineStar,
} from "react-icons/ai";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000"

const dashboardCards = [
  {
    title: "Manage Orders",
    description: "View and manage all orders",
    icon: AiOutlineShoppingCart,
    path: "./restaurant/orders",
    color: "text-red-500",
  },
  {
    title: "Manage Restaurant",
    description: "Edit and update restaurant details",
    icon: AiOutlineShop,
    path: "./restaurant/detail/[ownerId]",
    color: "text-yellow-500",
  },
  {
    title: "Sales",
    description: "View sales performance",
    icon: AiOutlineDollar,
    path: "./restaurant/sales",
    color: "text-green-500",
  },
  {
    title: "Manage Menu",
    description: "Edit and update the restaurant menu",
    icon: AiOutlineMenu,
    path: "./restaurant/menu/[ownerId]",
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
    path: "/staff",
    color: "text-teal-500",
  },
  {
    title: "Customer Reviews",
    description: "View and respond to customer reviews",
    icon: AiOutlineStar,
    path: "/reviews",
    color: "text-orange-500",
  },
];

const Dashboard = () => {
  const router = useRouter();
  const [ownerId, setOwnerId] = useState<string | null>(null); // State to hold ownerId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerId = async () => {
      try {
        const response = await fetch('/api/user'); // Replace with your actual endpoint
        if (!response.ok) throw new Error('Failed to fetch owner ID');
        const data = await response.json();
        setOwnerId(data.ownerId); // Assuming the API returns { ownerId: 'someOwnerId' }
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerId();
  }, []);

  const navigateTo = (path: string) => {
    if (ownerId) {
      const actualPath = path.replace("[ownerId]", ownerId);
      router.push(actualPath);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen py-10 mt-24 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900">Restaurant Owner Dashboard</h1>
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
                  <h2 className="text-2xl font-semibold text-gray-800">{card.title}</h2>
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
