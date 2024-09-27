"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { BsCart2 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import logo from "../../src/assets/logo2.png";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { useCart } from "../hooks/useCart"; // Import the useCart hook for cart management

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth(); // Use the useAuth hook
  const { items } = useCart(); // Use the useCart hook to fetch cart items from sessionStorage

  const handleLogout = () => {
    logout(); // Call logout function from useAuth
    router.push("/signin");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center max-w-screen-xl px-6 py-3 mx-auto">
        <div className="flex flex-grow">
          <Image
            className="cursor-pointer w-36"
            src={logo}
            alt="logo"
            onClick={() => router.push("/")}
          />
        </div>
        {isAuthenticated ? ( // Check if user is authenticated
          <div className="flex items-center justify-end space-x-4">
            {user?.role === "restaurant_owner" && (
              <Link href="/dashboard">
                <a className="text-gray-600">Dashboard</a>
              </Link>
            )}
            <div
              className="relative flex cursor-pointer"
              onClick={() => router.push("/Cart")}
            >
              <span className="absolute flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary -right-2 -top-2">
                {items.length} {/* Display cart items count */}
              </span>
              <BsCart2 className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>
            <p className="hidden text-gray-700 md:block">{user?.name}</p>
            <FiLogOut
              className="w-6 h-6 text-gray-700 cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-6">
            <button
              className="px-6 py-3 bg-white rounded-full text-primary"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </button>
            <button
              className="px-6 py-3 text-white rounded-full bg-primary"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
