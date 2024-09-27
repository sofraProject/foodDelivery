"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import logo from "../../src/assets/logo2.png";
import { authHelper } from "../helpers/authHelper";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const Navbar: React.FC = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth(); // Using useAuth hook
  const { items } = useCart(); // Using useCart hook for cart management
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const [userData, setUserData] = useState<any>(null); // State to hold user data
  const [userId, setUserId] = useState<string | null>(null); // State to hold userId
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch userId from authHelper
  useEffect(() => {
    if (
      authHelper?.decodedUser &&
      typeof authHelper.decodedUser === "object" &&
      "id" in authHelper.decodedUser
    ) {
      setUserId(authHelper.decodedUser.id);
    } else {
      console.log("User not authenticated");
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  // Fetch user data by ID when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${serverDomain}/api/users/${userId}`
          );
          console.log(response.data, "------- check here");
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center justify-between max-w-screen-xl px-6 py-3 mx-auto">
        {/* Left: Logo */}
        <div className="flex flex-grow">
          <Image
            className="cursor-pointer w-36"
            src={logo}
            alt="logo"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow max-w-md mx-auto mr-4">
          <input
            type="text"
            placeholder="What can we get you?"
            className="w-full px-4 py-2 border rounded-full"
          />
        </div>

        {/* Right: Cart and User Menu */}
        <div className="relative flex items-center space-x-6">
          {/* Cart Icon */}
          <div
            className="relative flex cursor-pointer"
            onClick={() => router.push("/cart")}
          >
            <span className="absolute flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary -right-2 -top-2">
              {items.length}
            </span>
            <BsCart2 className="w-6 h-6 text-gray-700 cursor-pointer" />
          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative flex items-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center px-6 py-3 space-x-2 text-white rounded-full bg-primary"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{userData ? userData.name : "User"}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-5 bg-white rounded-lg shadow-2xl w-44">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-gray-700"
                    >
                      Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-gray-700"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/promocodes"
                      className="block px-4 py-2 text-gray-700"
                    >
                      Promo Codes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-gray-700"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
