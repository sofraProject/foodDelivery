"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
import { signUpUser } from "../../redux/features/authSlice";
import { AppDispatch } from "../../redux/store";
import Brand from "../../components/Form/Brand";
import Button from "../../components/Form/Button";
import TextField from "../../components/Form/TextField";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState<string | null>(null);
  // const [location, setLocation] = useState<[number, number] | null>(null);
  const dispatch: AppDispatch = useDispatch();

  // const getLocation = () => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(position.coords);

  //         setLocation([position.coords.longitude, position.coords.latitude]);
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         setError(
  //           "Unable to get location. Please try again or enter manually."
  //         );
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by your browser.");
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        signUpUser({
          name,
          email,
          password,
          role,
        })
      );
      router.push("/signIn");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Sign up failed");
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
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
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
            <select
              title="Role"
              value={role}
              name="role"
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="customer">Customer</option>
              <option value="restaurant_owner">Restaurant Owner</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <Button text="Sign Up" />
          <Link href="/signIn">
            <p className="my-6 text-base text-center text-primary hover:underline">
              Already have an account?
            </p>
          </Link>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </main>
  );
};

export default SignUp;
