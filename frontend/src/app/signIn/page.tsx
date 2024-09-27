"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Brand from "../../components/Form/Brand";
import Button from "../../components/Form/Button";
import TextField from "../../components/Form/TextField";
import { useAuth } from "../../hooks/useAuth"; // Import the useAuth hook

const SignIn: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, isAuthenticated } = useAuth(); // Use useAuth hook

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password); // Call the login function from useAuth

    if (isAuthenticated) {
      // Check if user is authenticated after login
      router.push("/"); // Redirect to home or specific route based on role
    }
  };

  return (
    <main className="w-full h-screen banner">
      <div className="flex flex-col items-center justify-center h-screen">
        <Brand />
        <form
          onSubmit={handleSubmit}
          className="p-4 mt-6 bg-white rounded-lg shadow-lg w-96"
        >
          <div className="flex flex-col space-y-6">
            <TextField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button text={loading ? "Signing In..." : "Sign In"} />
          {error && <p className="mt-2 text-center text-red-500">{error}</p>}
          <Link href="/signup">
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
