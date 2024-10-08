"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import errorImg from "../assets/error.png";
const ErrorScreen = () => {
  const router = useRouter();

  return (
    <main className="h-screen banner">
      <div className="max-w-screen-xl py-20 mx-auto px-6">
        <div className="flex flex-col items-center justify-center h-3/4 pt-24">
          <Image className="w-96 object-contain" src={errorImg} alt="error" />

          <button
            className="bg-primary text-white px-8 py-2 focus:outline-none poppins rounded-full mt-24 transform transition duration-300 hover:scale-105"
            onClick={() => router.push("/")}
          >
            Go back to home
          </button>
        </div>
      </div>
    </main>
  );
};

export default ErrorScreen;
