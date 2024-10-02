"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

// Interface to define the structure of a location object
interface Location {
  id: number;
  locationName?: string;
  lat?: number;
  long?: number;
}

const MyLocations: React.FC = () => {
  const { user } = useAuth(); // Access user authentication details
  const [locations, setLocations] = useState<Location[]>([]); // State for storing user locations
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [showModal, setShowModal] = useState(false); // State to toggle add location modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State to confirm location deletion
  const [deleteLocationId, setDeleteLocationId] = useState<number | null>(null); // ID of the location to delete
  const [newLocationName, setNewLocationName] = useState(""); // New location name input
  const [newLat, setNewLat] = useState<number | undefined>(); // New latitude input
  const [newLong, setNewLong] = useState<number | undefined>(); // New longitude input
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE; // Fetch server domain from environment variables

  // Fetch user locations when the component mounts or user changes
  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) {
        setLoading(false); // If user is not authenticated, stop loading
        return;
      }

      const url = `${serverDomain}/api/locations/user/${user.id}`; // Construct API URL
      try {
        const response = await axios.get<Location[]>(url); // Fetch locations from API
        setLocations(response.data); // Update locations state with fetched data
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to fetch locations."); // Set error message on failure
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchLocations();
  }, [user, serverDomain]); // Dependency array: refetch when user or serverDomain changes

  // Handle adding a new location
  const handleAddLocation = async () => {
    try {
      const newLocation = {
        locationName: newLocationName,
        lat: newLat,
        long: newLong,
        userId: user?.id, // Associate location with authenticated user
      };
      const response = await axios.post(`${serverDomain}/api/locations`, newLocation); // POST request to add location
      setLocations([...locations, response.data]); // Update state with new location
      setShowModal(false); // Close modal
      // Reset input fields
      setNewLocationName("");
      setNewLat(undefined);
      setNewLong(undefined);
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Failed to add location."); // Set error message on failure
    }
  };

  // Handle deleting a location
  const handleDeleteLocation = async () => {
    if (deleteLocationId === null) return; // Exit if no location ID is set

    try {
      await axios.delete(`${serverDomain}/api/locations/${deleteLocationId}`); // DELETE request to remove location
      setLocations(locations.filter(location => location.id !== deleteLocationId)); // Update state to remove deleted location
      setShowDeleteConfirm(false); // Close confirmation modal
      setDeleteLocationId(null); // Reset delete location ID
    } catch (err) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location."); // Set error message on failure
    }
  };

  // Render loading state
  if (loading) return <div className="text-center">Loading...</div>;
  // Render error state
  if (error) return <div className="text-warning text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">My Locations</h1>
      <button
        onClick={() => setShowModal(true)} // Open add location modal
        className="mb-4 px-4 py-2 bg-success text-white rounded hover:bg-green-700 transition"
      >
        Add Location
      </button>
      {locations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="bg-secondary border rounded-lg p-4 shadow-md transition-transform transform hover:scale-105 relative flex flex-col justify-between mb-4"
            >
              <h2 className="text-lg font-semibold text-dark">{location.locationName || "Unnamed"}</h2>
              <p className="text-sm text-lightText mt-1">
                {location.lat ? `Lat: ${location.lat.toFixed(4)}` : 'Lat: N/A'} &nbsp; 
                {location.long ? `Long: ${location.long.toFixed(4)}` : 'Long: N/A'}
              </p>
              <button
                onClick={() => {
                  setDeleteLocationId(location.id); // Set ID for deletion
                  setShowDeleteConfirm(true); // Open deletion confirmation modal
                }}
                className="absolute top-2 right-2 text-warning hover:bg-warning-light rounded-full p-1 ml-2"
                title="Delete Location"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lightText">No locations found.</p> // Message for no locations
      )}

      {/* Modal for adding a new location */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-primary">Add New Location</h2>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)} // Update location name
              className="border rounded mb-2 p-2 w-full"
            />
            <input
              type="number"
              placeholder="Latitude"
              value={newLat}
              onChange={(e) => setNewLat(parseFloat(e.target.value))} // Update latitude
              className="border rounded mb-2 p-2 w-full"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={newLong}
              onChange={(e) => setNewLong(parseFloat(e.target.value))} // Update longitude
              className="border rounded mb-4 p-2 w-full"
            />
            <button
              onClick={handleAddLocation} // Trigger add location
              className="mb-2 px-4 py-2 bg-success text-white rounded hover:bg-green-700 transition"
            >
              Add Location
            </button>
            <button
              onClick={() => setShowModal(false)} // Close modal
              className="px-4 py-2 bg-warning text-white rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for confirming deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this location?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteLocation} // Confirm deletion
                className="mr-2 px-4 py-2 bg-success text-white rounded hover:bg-green-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                className="px-4 py-2 bg-warning text-white rounded hover:bg-red-700 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLocations;
