"use client";

import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Back: React.FC = () => {
  return (
    <div className="relative top-8">
      <Link
        href="/"
        className="flex items-center space-x-2 text-gray-700 select-none hover:underline poppins"
      >
        <MdOutlineKeyboardBackspace />
        <span>Back</span>
      </Link>
    </div>
  );
};

export default Back;
