"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

const Navbar: React.FC = () => {
  const router = useRouter();
  const { logout, isAuthenticated, decodedUser } = useAuth();
  const { items } = useCart();
  const [userData, setUserData] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user data based on decodedUser
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && decodedUser?.id) {
        try {
          const response = await axios.get(
            `${serverDomain}/api/users/${decodedUser.id}`
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error retrieving user data", error);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated, decodedUser]);

  // Handle click outside dropdown
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/joinus");
  };

  const renderCartIcon = () => (
    <div
      className="relative flex mr-4 cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <span className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full text-dark bg-primary -right-2 -top-2">
        {items.length}
      </span>
      <BsCart2 className="w-6 h-6 text-white cursor-pointer" />
    </div>
  );

  const renderUserMenu = () => (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        className="flex items-center px-6 py-3 space-x-2 text-white bg-gray-700 rounded-full hover:bg-gray-600"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <FaRegUser />
        <span>{userData?.name || "User"}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 bg-gray-800 rounded-lg shadow-lg w-44 top-full">
          <Link
            href="/account"
            className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:rounded-lg"
          >
            Account
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:rounded-lg"
          >
            Orders
          </Link>
          <Link
            href="/promocodes"
            className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:rounded-lg"
          >
            Promo Codes
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-700 hover:rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  const renderAuthButtons = () => (
    <div className="flex space-x-4">
      <button
        className="px-6 py-3 space-x-2 text-sm font-bold text-black rounded-full bg-primary hover:bg-accent"
        onClick={() => router.push("/joinus")}
      >
        Join Us
      </button>
    </div>
  );

  const renderRoleSpecificLinks = () => {
    if (!userData?.role) return null;

    const roleLinks: { [key: string]: string } = {
      DRIVER: "/dashboard/driver",
      RESTAURANT_OWNER: "/dashboard/restaurant",
      ADMIN: "/admin",
    };

    return roleLinks[userData.role] ? (
      <Link
        href={roleLinks[userData.role]}
        className="text-sm text-white hover:underline"
      >
        {userData.role === "admin" ? "Switch to Admin" : "Dashboard"}
      </Link>
    ) : null;
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-900 shadow-lg">
      <nav className="flex items-center justify-between max-w-screen-xl px-6 py-4 mx-auto">
        <div className="flex flex-grow">
          <Image
            className="cursor-pointer w-36"
            src={logo}
            alt="logo"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex-grow max-w-md mx-auto">
          {/* <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full px-4 py-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          /> */}
        </div>
        <div className="relative flex items-center space-x-6">
          {renderCartIcon()}
          {isAuthenticated ? (
            <>
              {renderRoleSpecificLinks()}
              {renderUserMenu()}
            </>
          ) : (
            renderAuthButtons()
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
