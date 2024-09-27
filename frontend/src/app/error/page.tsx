"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import Spinner from "../../components/Spinner";
import paymentFailed from "../assets/undraw_Not_found_re_bh2e.png";
const PaymentFailedScreen = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <main className="h-screen banner">
      <div className="max-w-screen-xl px-6 py-20 mx-auto">
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="flex flex-col items-center justify-center pt-24 h-3/4">
            <h1 className="flex items-center space-x-6 text-3xl font-semibold text-center text-red-600 poppins">
              <MdError className="text-3xl text-red-600" /> Payment Failed
            </h1>
            <Image
              className="object-contain w-96"
              href={paymentFailed}
              alt="paymentFailed"
            />
            <p className="mt-4 text-center text-gray-600">
              We're sorry, but your payment couldn't be processed. Please try
              again or contact support.
            </p>
            <button
              className="px-8 py-2 mt-12 text-white transition duration-300 transform bg-red-600 rounded-full focus:outline-none poppins hover:scale-105"
              onClick={() => router.push("/cart")}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentFailedScreen;
