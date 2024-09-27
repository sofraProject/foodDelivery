"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../src/assets/logo2.png";
import { logoutUser } from "../../libs/redux/features/authSlice";
import { AppDispatch, RootState } from "../../libs/redux/store";

const Navbar: React.FC = () => {
  const [changeHeader, setChangeHeader] = useState<boolean>(false);
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.users);
  const { items } = useSelector((state: RootState) => state.cart);

  const onChangeHeader = () => {
    if (window.scrollY >= 50) {
      setChangeHeader(true);
    } else {
      setChangeHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onChangeHeader);
    return () => window.removeEventListener("scroll", onChangeHeader);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/signin");
  };

  return (
    <header
      className={
        changeHeader
          ? "bg-white fixed z-50 top-0 left-0 w-full shadow-md transition duration-500"
          : "bg-transparent fixed z-50 top-0 left-0 w-full transition duration-500"
      }
    >
      <nav className="flex items-center max-w-screen-xl px-6 py-3 mx-auto">
        {/* left */}
        <div className="flex flex-grow">
          <Image
            className="cursor-pointer w-36"
            src={logo}
            alt="logo"
            onClick={() => router.push("/")}
          />
        </div>
        {/* right */}
        {user ? (
          <div className="flex items-center justify-end space-x-4">
            {user.role === "driver" && (
              <Link href="/delivery-interface" className="text-gray-600">
              Delivery Interface
            </Link>
            )}
            {user.role === "restaurant_owner" && (
              <Link href="/dashboard" className="text-gray-600">
                Dashboard
              </Link>
            )}
            <div
              className="relative flex cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <span className="absolute flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary poppins -right-2 -top-2">
                {items.length}
              </span>
              <BsCart2 className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>

            <p className="hidden text-gray-700 poppins md:block lg:block">
              {user.name}
            </p>
            <FiLogOut
              className="w-6 h-6 text-gray-700 cursor-pointer"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-6">
            <button
              className="px-6 py-3 transition transform bg-white rounded-full d uration-700 text-primary poppins ring-red-300 focus:outline-none focus:ring-4 hover:scale-105"
              onClick={() => router.push("/signIn")}
            >
              Sign In
            </button>
            <button
              className="px-6 py-3 text-white transition duration-700 transform rounded-full bg-primary poppins ring-red-300 focus:outline-none focus:ring-4 hover:scale-105"
              onClick={() => router.push("/signUp")}
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
