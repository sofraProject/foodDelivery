"use client";

import { useRouter } from "next/navigation";
import {
  AiOutlineCar,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineDollar,
  AiOutlineMessage,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";

const dashboardCards = [
  {
    title: "Manage Deliveries",
    description: "View and manage your deliveries",
    icon: AiOutlineCar, // Icon for managing deliveries
    path: "./driver/orders",
    color: "text-red-500",
  },
  {
    title: "View Routes",
    description: "See routes for upcoming deliveries",
    icon: AiOutlineUnorderedList, // Icon for viewing routes
    path: "/driver/routes",
    color: "text-yellow-500",
  },
  {
    title: "Delivery Earnings",
    description: "View your earnings from deliveries",
    icon: AiOutlineDollar, // Icon for viewing earnings
    path: "/driver/earnings",
    color: "text-green-500",
  },
  {
    title: "Active Orders",
    description: "Track active orders in real time",
    icon: AiOutlineClockCircle, // Icon for tracking active orders
    path: "/driver/active-orders",
    color: "text-blue-500",
  },
  {
    title: "Completed Deliveries",
    description: "View past completed deliveries",
    icon: AiOutlineCheckCircle, // Icon for completed deliveries
    path: "/driver/completed-deliveries",
    color: "text-purple-500",
  },
  {
    title: "Manage Profile",
    description: "Update your driver profile information",
    icon: AiOutlineUser, // Icon for profile management
    path: "/driver/profile",
    color: "text-teal-500",
  },
  {
    title: "Customer Feedback",
    description: "View feedback and ratings from customers",
    icon: AiOutlineMessage, // Icon for viewing customer feedback
    path: "/driver/feedback",
    color: "text-orange-500",
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
          Driver Dashboard
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
