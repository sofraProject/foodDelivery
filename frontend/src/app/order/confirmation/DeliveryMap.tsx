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
import IconDriver from "./Delivery.png";
import IconMe from "./Me.png";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Props = {
  userPosition: { lat: number; long: number };
  driverPosition: { lat: number; long: number };
};

const DeliveryMap: React.FC<Props> = ({ userPosition, driverPosition }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const animationRef = useRef<number | null>(null); // Pour gérer l'animation

  // Fonction pour interpoler entre deux points (position actuelle et destination)
  const interpolate = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Fonction pour simuler le déplacement du chauffeur
  const simulateDriverMovement = () => {
    let progress = 0; // Progression du déplacement (entre 0 et 1)
    const duration = 20000; // Durée de la simulation en millisecondes
    const stepTime = 50; // Intervalle de temps entre les étapes en ms
    const steps = duration / stepTime; // Nombre d'étapes
    const increment = 1 / steps;

    // Positions initiales et finales
    let currentLat = driverPosition.lat;
    let currentLng = driverPosition.long;
    const targetLat = userPosition.lat;
    const targetLng = userPosition.long;

    const moveDriver = () => {
      if (progress < 1) {
        progress += increment;

        // Calculer la nouvelle position
        const newLat = interpolate(currentLat, targetLat, progress);
        const newLng = interpolate(currentLng, targetLng, progress);

        // Mettre à jour la position du marqueur du chauffeur
        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLngLat([newLng, newLat]);
        }

        // // Recentrer la carte sur la nouvelle position
        // if (mapRef.current) {
        //   mapRef.current.flyTo({
        //     center: [newLng, newLat],
        //     essential: true,
        //     zoom: 14,
        //   });
        // }

        // Planifier la prochaine étape de déplacement
        animationRef.current = window.setTimeout(moveDriver, stepTime);
      }
    };

    // Lancer la première étape du déplacement
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

      // Ajouter les contrôleurs de zoom et navigation
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Marqueur du chauffeur avec une icône personnalisée
      const driverIcon = document.createElement("img");
      driverIcon.src = IconDriver.src; // Remplacez par le chemin de l'icône du chauffeur
      driverIcon.style.width = "40px"; // Ajustez la taille de l'icône
      driverIcon.style.height = "40px"; // Ajustez la taille de l'icône

      const driverMarker = new mapboxgl.Marker({
        element: driverIcon,
      })
        .setLngLat([driverPosition.long, driverPosition.lat])
        .addTo(map);

      driverMarkerRef.current = driverMarker;

      // Marqueur de l'utilisateur avec une icône personnalisée
      const userIcon = document.createElement("img");
      userIcon.src = IconMe.src; // Remplacez par le chemin de l'icône de l'utilisateur
      userIcon.style.width = "30px"; // Ajustez la taille de l'icône
      userIcon.style.height = "30px"; // Ajustez la taille de l'icône

      new mapboxgl.Marker({
        element: userIcon,
      })
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
    // Lancer la simulation lorsque les positions sont disponibles
    simulateDriverMovement();

    return () => {
      // Nettoyer l'animation lorsqu'on quitte le composant
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [driverPosition, userPosition]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default DeliveryMap;
