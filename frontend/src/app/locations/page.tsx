"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth'; // Adjust the path as needed

// Define the Location interface without ID and restaurant
interface Location {
  locationName?: string;
}

const MyLocations: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const url = `${serverDomain}/api/locations/user/${user.id}`;
      try {
        const response = await axios.get<Location[]>(url); // Specify the type for the response
        setLocations(response.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to fetch locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [user, serverDomain]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">My Locations</h1>
      {locations.length > 0 ? (
        <ul>
          {locations.map((location, index) => (
            <li key={index} className="border rounded-lg p-4 mb-2">
              <h2 className="text-lg font-semibold">{location.locationName || "Unnamed Location"}</h2>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No locations found.</p>
      )}
    </div>
  );
};

export default MyLocations;
