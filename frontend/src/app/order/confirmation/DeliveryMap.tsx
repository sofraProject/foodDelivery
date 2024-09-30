import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Props = {
  userPosition: { lat: number; long: number };
  driverPosition: { lat: number; long: number };
};

const DeliveryMap: React.FC<Props> = ({ userPosition, driverPosition }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [userPosition.long, userPosition.lat],
        zoom: 12,
      });

      mapRef.current = map;

      // Ajouter les contrôleurs de zoom et navigation
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Marqueur du chauffeur
      const driverMarker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([driverPosition.long, driverPosition.lat])
        .addTo(map);

      driverMarkerRef.current = driverMarker;

      // Marqueur de l'utilisateur
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([userPosition.long, userPosition.lat])
        .addTo(map);

      // Gérer le redimensionnement de la fenêtre
      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [userPosition, driverPosition]);

  useEffect(() => {
    if (driverMarkerRef.current && mapRef.current) {
      driverMarkerRef.current.setLngLat([
        driverPosition.long,
        driverPosition.lat,
      ]);
      mapRef.current.flyTo({
        center: [driverPosition.long, driverPosition.lat],
        essential: true,
      });
    }
  }, [driverPosition]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default DeliveryMap;
