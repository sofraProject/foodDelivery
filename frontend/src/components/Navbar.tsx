"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import logo from "../../src/assets/logo2.png";
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
    router.push("/signin");
  };

  const renderCartIcon = () => (
    <div
      className="relative flex cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <span className="absolute flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary -right-2 -top-2">
        {items.length}
      </span>
      <BsCart2 className="w-6 h-6 text-gray-700 cursor-pointer" />
    </div>
  );

  const renderUserMenu = () => (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        className="flex items-center px-6 py-3 space-x-2 text-white rounded-full bg-primary"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
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
        <div className="absolute right-0 z-50 mt-5 bg-white rounded-lg shadow-lg w-44 top-full">
          <Link href="/account" className="block px-4 py-2 text-gray-700">
            Account
          </Link>
          <Link href="/orders" className="block px-4 py-2 text-gray-700">
            Orders
          </Link>
          <Link href="/promocodes" className="block px-4 py-2 text-gray-700">
            Promo Codes
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-gray-700"
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
  );

  const renderRoleSpecificLinks = () => {
    if (!userData?.role) return null;

    const roleLinks: { [key: string]: string } = {
      driver: "/delivery-interface",
      restaurant_owner: "/dashboard",
      admin: "/admin",
    };

    return roleLinks[userData.role] ? (
      <Link href={roleLinks[userData.role]} className="text-gray-600">
        {userData.role === "admin" ? "Switch to Admin" : "Dashboard"}
      </Link>
    ) : null;
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center justify-between max-w-screen-xl px-6 py-3 mx-auto">
        <div className="flex flex-grow">
          <Image
            className="cursor-pointer w-36"
            src={logo}
            alt="logo"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex-grow max-w-md mx-auto">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full px-4 py-2 border rounded-full"
          />
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
