"use client";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import useSocket from "../../hooks/useSocket";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "";

interface DeliveryMapProps {
  orderId: string;
  initialDriverLocation: { lat: number; lng: number };
  clientLocation: { lat: number; lng: number };
  isDriver: boolean;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  orderId,
  initialDriverLocation,
  clientLocation,
  isDriver,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [driverLocation, setDriverLocation] = useState<[number, number]>([
    initialDriverLocation.lng,
    initialDriverLocation.lat,
  ]);

  const socket = useSocket(serverDomain);

  useEffect(() => {
    if (map.current) return;

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialDriverLocation.lng, initialDriverLocation.lat],
      zoom: 12,
    });

    // Add Delivery Guy Marker
    const addDeliveryGuyMarker = (map: mapboxgl.Map) => {
      const el = document.createElement("div");
      el.className = "delivery-guy-marker";
      el.style.width = "40px";
      el.style.height = "40px";
      new mapboxgl.Marker(el)
        .setLngLat([initialDriverLocation.lng, initialDriverLocation.lat])
        .addTo(map);
    };

    addDeliveryGuyMarker(map.current!);

    // Add Client Marker
    new mapboxgl.Marker({ color: "#F44336" })
      .setLngLat([clientLocation.lng, clientLocation.lat])
      .addTo(map.current);

    // Adjust map bounds to show both driver and client
    const bounds = new mapboxgl.LngLatBounds()
      .extend([initialDriverLocation.lng, initialDriverLocation.lat])
      .extend([clientLocation.lng, clientLocation.lat]);

    map.current.fitBounds(bounds, { padding: 50 });

    // Handle real-time updates for driver location
    const event = `deliveryUpdate-${orderId}`;
    const handleLocationUpdate = (data: {
      latitude: number;
      longitude: number;
    }) => {
      setDriverLocation([data.longitude, data.latitude]);
      fetchRoute(
        [data.longitude, data.latitude],
        [clientLocation.lng, clientLocation.lat]
      );
    };

    // Use optional chaining to ensure 'socket' is not null before using it
    socket?.on(event, handleLocationUpdate);

    return () => {
      socket?.off(event, handleLocationUpdate); // Optional chaining used here
      socket?.disconnect(); // Optional chaining used here
    };
  }, [orderId, initialDriverLocation, clientLocation, isDriver, socket]);

  useEffect(() => {
    if (driverMarker.current) {
      driverMarker.current.setLngLat(driverLocation);
    }
    if (map.current) {
      map.current.panTo(driverLocation);
    }
  }, [driverLocation]);

  // Fetch route from Mapbox Directions API
  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const route = response.data.routes[0].geometry.coordinates;

      if (map.current) {
        map.current.on("load", () => {
          if (map.current!.getSource("route")) {
            (map.current!.getSource("route") as mapboxgl.GeoJSONSource).setData(
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              }
            );
          } else {
            map.current!.addLayer({
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: route,
                  },
                },
              },
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3887be",
                "line-width": 5,
                "line-opacity": 0.75,
              },
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default DeliveryMap;
