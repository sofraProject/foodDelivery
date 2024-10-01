"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  MdArchive,
  MdDashboard,
  MdOutlineAddBox,
  MdOutlineArrowForwardIos,
  MdOutlineMenu,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface MenuItem {
  id: number;
  text: string;
  to: string;
  icon: React.ReactNode;
}

const SideNav: React.FC = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const [sidenav, setSidenav] = useState(true);

  // Toggling the side nav
  const handlenav = () => {
    setSidenav(!sidenav);
  };

  // Auto hide based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1098) {
        setSidenav(false);
      } else {
        setSidenav(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu: MenuItem[] = [
    {
      id: 1,
      text: "Dashboard",
      to: "/dashboard/restaurantowner/dashboard",
      icon: <MdDashboard />,
    },
    {
      id: 2,
      text: "Manage Products",
      to: "/dashboard/restaurantowner",
      icon: <MdOutlineMenu />,
    },
    {
      id: 3,
      text: "Add Product",
      to: "/dashboard/add-product",
      icon: <MdOutlineAddBox />,
    },
    {
      id: 4,
      text: "Archive Products",
      to: "/dashboard/Archived-Product",
      icon: <MdArchive />,
    },
  ];

  return (
    <div>
      {sidenav && (
        <>
          <nav className="fixed flex flex-col w-64 h-screen px-4 shadow-lg bg-gradient-to-b from-teal-400 to-cyan-500">
            <div className="flex flex-col flex-wrap items-center pt-12 mt-8">
              <div className="">
                <img
                  src={user?.imagesUrl} // Updated to imagesUrl based on the error
                  className="w-20 h-20 mx-auto border-2 border-gray-300 rounded-full"
                  alt={user?.email}
                />
              </div>
              <div className="pt-2">
                <span className="text-lg font-semibold text-white">
                  {user?.name}
                </span>
              </div>
            </div>

            <div className="mt-10 mb-4">
              <ul className="ml-4">
                {menu.map((item) => (
                  <li className="flex items-center mb-2" key={item.id}>
                    <Link
                      href={item.to}
                      className="flex items-center p-2 space-x-2 text-white transition-colors duration-200 rounded-md hover:bg-purple-300"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="ml-1 text-sm poppins">{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </>
      )}

      {/* Menu icon */}
      <div
        className="fixed block p-2 bg-purple-500 border border-gray-300 rounded-full shadow-xl cursor-pointer lg:hidden bottom-10 left-10"
        onClick={handlenav}
      >
        <MdOutlineArrowForwardIos className="text-2xl text-white" />
      </div>
    </div>
  );
};

export default SideNav;

