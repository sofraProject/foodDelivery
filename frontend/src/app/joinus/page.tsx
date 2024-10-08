"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/Form/Button";
import TextField from "../../components/Form/TextField";
import { useAuth } from "../../hooks/useAuth";
import { signUpUser } from "../../redux/features/authSlice";
import { AppDispatch } from "../../redux/store";

const AuthForm: React.FC = () => {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuth();
  const dispatch: AppDispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    setSignupError(null); // Reset error when form changes
  }, [isSignUp, email, password, name]);

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(
        signUpUser({
          name,
          email,
          password,
          role,
          profilePicture,
        })
      );
      router.push("/joinus");
    } catch (error) {
      console.error("Error signing up:", error);
      setSignupError("Sign up failed. Please try again.");
    }
  };

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Error signing in:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="w-full max-w-md p-8 transition-all duration-500 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">
          {isSignUp ? "Discover New Tastes!" : "Welcome Back,"}
        </h2>
        <h2 className="mb-6 text-2xl text-center text-white">
          {isSignUp ? "Sign Up and Order!" : "We’ve Missed You!"}
        </h2>

        <div className="flex justify-center my-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 transform ${
              isSignUp ? "bg-primary text-dark scale-110" : "bg-gray-200"
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 transform ${
              !isSignUp ? "bg-primary text-dark scale-110" : "bg-gray-200"
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
        </div>

        <div style={{ height: "450px" }}>
          {isSignUp ? (
            <form
              className="w-full p-6 mt-6 bg-gray-200 rounded-lg shadow-md"
              onSubmit={handleSignUpSubmit}
            >
              <div className="flex flex-col space-y-6">
                <TextField
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
                <TextField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
                <TextField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePicture(e.target.files?.[0] || null)
                  }
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
                <select
                  title="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                  <option value="DRIVER">Driver</option>
                </select>
              </div>
              <Button text="Sign Up" className="mt-6" />
              {signupError && (
                <p className="mt-4 text-red-500">{signupError}</p>
              )}
            </form>
          ) : (
            <form
              className="w-full p-6 mt-6 bg-gray-200 rounded-lg shadow-md"
              onSubmit={handleSignInSubmit}
            >
              <div className="flex flex-col space-y-6">
                <TextField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
                <TextField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-primary focus:border-primary"
                />
              </div>
              <Button
                text={loading ? "Signing In..." : "Sign In"}
                className="mt-6"
              />
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthForm;
