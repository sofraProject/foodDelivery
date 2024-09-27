// hooks/useAuth.ts

import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, signUpUser } from "../redux/features/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, error } = useSelector((state: RootState) => state.users);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      const userData = unwrapResult(resultAction);
      localStorage.setItem("token", userData.token);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(user);
  const logout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutUser());
      localStorage.removeItem("token");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        signUpUser({ name, email, password, role })
      );
      unwrapResult(resultAction);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status from localStorage
  const Token = localStorage.getItem("token");
  const isAuthenticated = !!Token;
  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "customer";
  const isDriver = user?.role === "driver";
  const isRestaurantOwner = user?.role === "restaurant_owner";

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated,
    isAdmin,
    isClient,
    isDriver,
    isRestaurantOwner,
  };
};
