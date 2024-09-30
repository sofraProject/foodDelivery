"use client";

import axios from "axios";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import swal from "sweetalert";
import { useAuth } from "../../hooks/useAuth"; // Import the useAuth hook

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const MapboxMap: React.FC = () => {
  const { decodedUser, isClient, isRestaurantOwner } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState(10.1815);
  const [lat, setLat] = useState(36.8065);
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSaved, setLocationSaved] = useState(false);
  const router = useRouter();

  // Get current location based on user type
  const handleUseCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLng(longitude);
          setLat(latitude);
          setLoading(false);
          swal(
            "Location Set!",
            "Your current location has been set.",
            "success"
          );

          if (map.current) {
            if (!markerRef.current) {
              markerRef.current = new mapboxgl.Marker({
                color: "green",
                draggable: true,
              })
                .setLngLat([longitude, latitude])
                .addTo(map.current);
              markerRef.current.on("dragend", () => {
                const lngLat = markerRef.current!.getLngLat();
                setLng(lngLat.lng);
                setLat(lngLat.lat);
                map.current!.flyTo({
                  center: [lngLat.lng, lngLat.lat],
                  zoom: 15,
                });
              });
            } else {
              markerRef.current.setLngLat([longitude, latitude]);
              setLng(longitude);
              setLat(latitude);
            }
            map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          setLocationError("Unable to retrieve location.");
        }
      );
    } else {
      setLoading(false);
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  // Fetch restaurant info and save location
  const saveLocation = async (latitude: number, longitude: number) => {
    try {
      let restaurantId = null;

      if (isRestaurantOwner) {
        // Fetch restaurant info based on the user's ID
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAINE}/api/restaurants/owner/${decodedUser?.id}`
        );
        restaurantId = data.id; // Assume restaurant data contains the restaurant ID
      }

      const locationName = isClient
        ? "Customer Location"
        : "Restaurant Location";
      const userId = decodedUser?.id;

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAINE}/api/locations`,
        {
          lat: latitude,
          long: longitude,
          locationName,
          userId: isClient ? userId : null,
          restaurantId: isRestaurantOwner ? restaurantId : null,
        }
      );

      setLocationSaved(true);
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", handleUseCurrentLocation);

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true, timeout: 10000 },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocateControl);

    geolocateControl.on("geolocate", (e) => {
      const { longitude, latitude } = e.coords;
      setLng(longitude);
      setLat(latitude);
      setLoading(false);

      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      } else {
        markerRef.current = new mapboxgl.Marker({
          color: "red",
          draggable: true,
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
      }

      map.current!.flyTo({ center: [longitude, latitude], zoom: 15 });

      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current!.getLngLat();
        setLng(lngLat.lng);
        setLat(lngLat.lat);
        map.current!.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: 15 });
      });
    });

    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setLocationError("Geolocation took too long.");
      }
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  const renderStatusMessage = () => {
    if (locationError) {
      return <span className="text-red-600">{locationError}</span>;
    }
    return loading ? (
      <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
    ) : (
      <AiOutlineCheckCircle className="w-5 h-5" />
    );
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full py-6 bg-white">
        <div className="flex items-center justify-between px-6 py-8 mx-auto max-w-7xl">
          <h1 className="text-5xl font-bold text-gray-900">SAVE MY LOCATION</h1>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 ml-4 rounded-lg bg-primary text-dark hover:text-primary hover:bg-dark"
          >
            <AiOutlineCheckCircle className="w-5 h-5 mr-2" />
            Back to home
          </button>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <div className="flex w-full mt-6">
          <section className="w-full pl-8">
            <div className="p-8 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <ul>
                <motion.li
                  key="location-status"
                  className="flex items-center mb-4 text-green-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {renderStatusMessage()}
                  <span className="ml-2 text-xl">
                    {loading ? "Retrieving your location..." : "Location set!"}
                  </span>
                </motion.li>
              </ul>

              <div
                ref={mapContainer}
                className="w-full h-[500px] mt-10 rounded-lg shadow-lg"
              />

              {!loading && (
                <div className="mt-6">
                  <button
                    onClick={() => saveLocation(lat, lng)}
                    className={`px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${
                      locationSaved ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={locationSaved}
                  >
                    {locationSaved ? "Location saved" : "Save my location"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MapboxMap;
