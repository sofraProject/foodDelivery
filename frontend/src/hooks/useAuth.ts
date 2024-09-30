import { unwrapResult } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, signUpUser } from "../redux/features/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, error } = useSelector((state: RootState) => state.users);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [decodedUser, setDecodedUser] = useState<any>(null);

  // Initialize user from token stored in localStorage
  const initializeUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token) as any;
      setDecodedUser(decoded);
      setIsAuthenticated(!!decoded);
    }
  };

  useEffect(() => {
    initializeUserFromToken(); // Runs once on mount
  }, []);

  const handleAuthResponse = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      const decoded = jwt.decode(token) as any;
      setDecodedUser(decoded);
      setIsAuthenticated(true);
    }
  };

  // Optimized login with check for existing token
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      const { token } = unwrapResult(resultAction);
      handleAuthResponse(token);

      // Forcer le rechargement de la page après connexion
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await dispatch(logoutUser());
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        setDecodedUser(null);
        setIsAuthenticated(false);
      }
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
      const { token } = unwrapResult(resultAction);
      handleAuthResponse(token);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const roles = {
    isAdmin: decodedUser?.role === "ADMIN",
    isClient: decodedUser?.role === "CUSTOMER",
    isDriver: decodedUser?.role === "DRIVER",
    isRestaurantOwner: decodedUser?.role === "RESTAURANT_OWNER",
  };

  const memoizedDecodedUser = useMemo(() => decodedUser, [decodedUser]);
  const memoizedIsAuthenticated = useMemo(
    () => isAuthenticated,
    [isAuthenticated]
  );

  return {
    decodedUser: memoizedDecodedUser,
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: memoizedIsAuthenticated,
    ...roles,
  };
};
