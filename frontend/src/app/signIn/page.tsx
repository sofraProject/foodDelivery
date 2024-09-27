"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import Brand from "../../components/Form/Brand";
import Button from "../../components/Form/Button";
import TextField from "../../components/Form/TextField";
import { loginUser } from "../../../libs/redux/features/authSlice";
import { AppDispatch, RootState } from "../../../libs/redux/store";
import "../../styles/globals.css";
import "../../styles/tailwind.css";

const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch: AppDispatch = useDispatch();
  // const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.users);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      const user = unwrapResult(resultAction);
      console.log(
        user.token,
        "==================================================="
      );

      localStorage.setItem("token", user.token);
      if (user.role === "restaurant_owner") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <main className="w-full h-screen banner">
      <div className="flex flex-col items-center justify-center h-screen">
        <Brand />
        <form
          className="p-4 mt-6 bg-white rounded-lg shadow-lg w-96"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col space-y-6">
            <TextField
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button text="Sign In" />
          {status === "failed" && (
            <p className="mt-2 text-center text-red-500">{error}</p>
          )}
          <Link href="/signUp">
            <p className="my-6 text-base text-center text-primary hover:underline">
              Need an account?
            </p>
          </Link>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
