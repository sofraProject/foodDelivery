import React from "react";
import DeliveryMap from "../DeliveryMap";

interface Location {
  type: string;
  coordinates: [number, number]; // Tableau avec lat et long
}

interface CustomerMapContainerProps {
  orderId: string;
  currentLocation: Location;
  clientLocation: Location;
  orderStatus: string;
}

const CustomerMapContainer: React.FC<CustomerMapContainerProps> = ({
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
      <h2 className="mb-4 text-2xl font-bold">Live Delivery Tracking</h2>
      <div className="overflow-hidden rounded-lg h-96">
        <DeliveryMap
          orderId={orderId}
          initialDriverLocation={{
            lat: currentLocation.coordinates[1], // Utilise le deuxième élément du tableau pour la latitude
            lng: currentLocation.coordinates[0], // Utilise le premier élément pour la longitude
          }}
          clientLocation={{
            lat: clientLocation.coordinates[1],
            lng: clientLocation.coordinates[0],
          }}
          isDriver={false} // C'est pour la vue client
        />
      </div>
    </div>
  );
};

export default CustomerMapContainer;
