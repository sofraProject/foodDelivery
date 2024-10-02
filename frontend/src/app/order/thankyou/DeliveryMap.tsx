// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import React, { useEffect, useRef } from "react";
// import IconDriver from "./Delivery.png";
// import IconMe from "./Me.png";
// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// type Props = {
//   userPosition: { lat: number; long: number };
//   driverPosition: { lat: number; long: number };
// };

// const DeliveryMap: React.FC<Props> = ({ userPosition, driverPosition }) => {
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);

//   useEffect(() => {
//     if (mapContainerRef.current && !mapRef.current) {
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v12",
//         center: [userPosition.long, userPosition.lat],
//         zoom: 12,
//       });

//       mapRef.current = map;

//       // Ajouter les contrôleurs de zoom et navigation
//       map.addControl(new mapboxgl.NavigationControl(), "top-right");

//       // Marqueur du chauffeur avec une icône personnalisée
//       const driverIcon = document.createElement("img");
//       driverIcon.src = IconDriver.src; // Remplacez par le chemin de l'icône du chauffeur
//       driverIcon.style.width = "40px"; // Ajustez la taille de l'icône
//       driverIcon.style.height = "40px"; // Ajustez la taille de l'icône

//       const driverMarker = new mapboxgl.Marker({
//         element: driverIcon,
//       })
//         .setLngLat([driverPosition.long, driverPosition.lat])
//         .addTo(map);

//       driverMarkerRef.current = driverMarker;

//       // Marqueur de l'utilisateur avec une icône personnalisée
//       const userIcon = document.createElement("img");
//       userIcon.src = IconMe.src; // Remplacez par le chemin de l'icône de l'utilisateur
//       userIcon.style.width = "30px"; // Ajustez la taille de l'icône
//       userIcon.style.height = "30px"; // Ajustez la taille de l'icône

//       new mapboxgl.Marker({
//         element: userIcon,
//       })
//         .setLngLat([userPosition.long, userPosition.lat])
//         .addTo(map);

//       // Gérer le redimensionnement de la fenêtre
//       const resizeObserver = new ResizeObserver(() => {
//         map.resize();
//       });
//       resizeObserver.observe(mapContainerRef.current);

//       return () => resizeObserver.disconnect();
//     }
//   }, [userPosition, driverPosition]);

//   useEffect(() => {
//     if (driverMarkerRef.current && mapRef.current) {
//       driverMarkerRef.current.setLngLat([
//         driverPosition.long,
//         driverPosition.lat,
//       ]);
//       mapRef.current.flyTo({
//         center: [driverPosition.long, driverPosition.lat],
//         essential: true,
//       });
//     }
//   }, [driverPosition]);

//   return <div ref={mapContainerRef} className="w-full h-full" />;
// };

// export default DeliveryMap;

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import IconDriver from "../../../assets/Delivery.png";
import IconMe from "../../../assets/Me.png";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Props = {
  userPosition: { lat: number; long: number };
  driverPosition: { lat: number; long: number };
};

const DeliveryMap: React.FC<Props> = ({ userPosition, driverPosition }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null); // For managing the animation

  // Function to interpolate between two points (current position and destination)
  const interpolate = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Function to simulate the driver movement
  const simulateDriverMovement = () => {
    let progress = 0; // Movement progress (between 0 and 1)
    const duration = 15000; // Duration of the simulation in milliseconds (15 seconds)
    const stepTime = 50; // Time interval between steps in ms
    const steps = duration / stepTime; // Number of steps
    const increment = 1 / steps;

    // Initial and target positions
    let currentLat = driverPosition.lat;
    let currentLng = driverPosition.long;
    const targetLat = userPosition.lat;
    const targetLng = userPosition.long;

    const moveDriver = () => {
      if (progress < 1) {
        progress += increment;

        // Calculate the new position
        const newLat = interpolate(currentLat, targetLat, progress);
        const newLng = interpolate(currentLng, targetLng, progress);

        // Update the driver's marker position
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLngLat([newLng, newLat]);
        }

        // Schedule the next movement step
        animationRef.current = window.setTimeout(moveDriver, stepTime);
      }
    };

    // Start the first movement step
    moveDriver();
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [userPosition.long, userPosition.lat],
        zoom: 12,
      });

      mapRef.current = map;

      // Add zoom and navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Driver marker with a custom icon
      const driverIcon = document.createElement("img");
      driverIcon.src = IconDriver.src; // Replace with the path to the driver icon
      driverIcon.style.width = "40px"; // Adjust the icon size
      driverIcon.style.height = "40px"; // Adjust the icon size

      const driverMarker = new mapboxgl.Marker({
        element: driverIcon,
      })
        .setLngLat([driverPosition.long, driverPosition.lat])
        .addTo(map);

      driverMarkerRef.current = driverMarker;

      // User marker with a custom icon
      const userIcon = document.createElement("img");
      userIcon.src = IconMe.src; // Replace with the path to the user icon
      userIcon.style.width = "30px"; // Adjust the icon size
      userIcon.style.height = "30px"; // Adjust the icon size

      new mapboxgl.Marker({
        element: userIcon,
      })
        .setLngLat([userPosition.long, userPosition.lat])
        .addTo(map);

      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [userPosition, driverPosition]);

  useEffect(() => {
    // Start the simulation when positions are available
    simulateDriverMovement();

    return () => {
      // Clean up the animation when the component is unmounted
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [driverPosition, userPosition]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default DeliveryMap;
