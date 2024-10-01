import React from "react";
import DeliveryMap from "../DeliveryMap";

interface Location {
  type: string;
  coordinates: [number, number]; // Tableau avec lat et long
}

interface DriverMapContainerProps {
  orderId: string;
  currentLocation: Location;
  clientLocation: Location;
  orderStatus: string;
}

const DriverMapContainer: React.FC<DriverMapContainerProps> = ({
  orderId,
  currentLocation,
  clientLocation,
  orderStatus,
}) => {
  if (orderStatus !== "IN_TRANSIT") {
    return null; // Affiche la carte uniquement si la commande est en transit
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Live Driver Location</h2>
      <div className="h-96 rounded-lg overflow-hidden">
        <DeliveryMap
          orderId={orderId}
          initialDriverLocation={{
            lat: currentLocation.coordinates[1], // Utilise coordinates
            lng: currentLocation.coordinates[0],
          }}
          clientLocation={{
            lat: clientLocation.coordinates[1],
            lng: clientLocation.coordinates[0],
          }}
          isDriver={true} // C'est pour la vue livreur
        />
      </div>
    </div>
  );
};

export default DriverMapContainer;
