"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface Location {
  id: number;
  locationName?: string;
  lat?: number;
  long?: number;
}

const MyLocations: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLat, setNewLat] = useState<number | undefined>();
  const [newLong, setNewLong] = useState<number | undefined>();
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const url = `${serverDomain}/api/locations/user/${user.id}`;
      try {
        const response = await axios.get<Location[]>(url);
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

  const handleAddLocation = async () => {
    try {
      const newLocation = {
        locationName: newLocationName,
        lat: newLat,
        long: newLong,
        userId: user.id // Include user's ID here
      };
      const response = await axios.post(`${serverDomain}/api/locations`, newLocation);
      setLocations([...locations, response.data]);
      setShowModal(false);
      setNewLocationName("");
      setNewLat(undefined);
      setNewLong(undefined);
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Failed to add location.");
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      await axios.delete(`${serverDomain}/api/locations/${id}`);
      setLocations(locations.filter(location => location.id !== id));
    } catch (err) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location.");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-left">My Locations</h1>
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Location
      </button>
      {locations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="bg-white border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 relative flex flex-col justify-between mb-4">
              <h2 className="text-lg font-semibold">{location.locationName || "Unnamed"}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {location.lat ? `Lat: ${location.lat.toFixed(4)}` : 'Lat: N/A'} &nbsp; 
                {location.long ? `Long: ${location.long.toFixed(4)}` : 'Long: N/A'}
              </p>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-100 rounded-full p-1 ml-2"
                title="Delete Location"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No locations found.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="border rounded mb-2 p-2 w-full"
            />
            <input
              type="number"
              placeholder="Latitude"
              value={newLat}
              onChange={(e) => setNewLat(parseFloat(e.target.value))}
              className="border rounded mb-2 p-2 w-full"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={newLong}
              onChange={(e) => setNewLong(parseFloat(e.target.value))}
              className="border rounded mb-4 p-2 w-full"
            />
            <button
              onClick={handleAddLocation}
              className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add Location
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLocations;
