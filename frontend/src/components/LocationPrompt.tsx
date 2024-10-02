"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import swal from "sweetalert"; // For user feedback
import { updateUserLocation } from "../redux/features/authSlice";
import { AppDispatch } from "../redux/store";

interface LocationPromptProps {
  onLocationSet: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onLocationSet }) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for geolocation
  const [error, setError] = useState<string | null>(null); // Error state
  const dispatch = useDispatch<AppDispatch>();

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // Handle geolocation request
  const handleUseCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(updateUserLocation([longitude, latitude]));
          onLocationSet();
          setLoading(false);
          swal(
            "Location Set!",
            "Your current location has been set.",
            "success"
          );
        },
        (error) => {
          setError("Failed to retrieve your location. Please try again.");
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Function to simulate geocoding API call (replace with actual API call)
  const geocodeAddress = async (address: string): Promise<[number, number]> => {
    // Simulate a successful geocode lookup
    return new Promise((resolve) => {
      setTimeout(() => {
        // Example coordinates for a successful address lookup
        resolve([34.0522, -118.2437]); // Example: Los Angeles, CA
      }, 2000);
    });
  };

  // Handle form submission for geocoding
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (address) {
      try {
        const [latitude, longitude] = await geocodeAddress(address);
        dispatch(updateUserLocation([longitude, latitude]));
        onLocationSet();
        setLoading(false);
        swal(
          "Location Set!",
          "The address has been converted to coordinates.",
          "success"
        );
      } catch (err) {
        setError("Failed to geocode the address. Please try again.");
        console.error("Error geocoding address:", err);
        setLoading(false);
      }
    } else {
      setError("Please enter a valid address.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="box-border flex items-center w-full p-1 overflow-hidden bg-white rounded-full ring-gray-300 focus-within:ring-4"
      >
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={handleAddressChange}
          className="w-full px-4 py-2 bg-transparent rounded-full focus:outline-none"
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="px-4 py-2 text-sm transition duration-300 transform rounded-full bg-dark text-primary poppins ring-gray-300 focus:ring-4 hover:scale-105"
        >
          {loading ? "Loading..." : "Use current location"}
        </button>
      </form>

      {/* Display error or success messages */}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {loading && !error && (
        <p className="mt-2 text-blue-500">Fetching location...</p>
      )}
    </div>
  );
};

export default LocationPrompt;