"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For accessing URL parameters

// Server domain for API requests
const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const MenuItemManagementPage = () => {
  const { restaurantId } = useParams(); // Accessing restaurantId from URL parameters

  // State variables
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "", price: "", categoryId: "", available: true });
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Fetch menu items when component mounts or restaurantId changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      // Validate restaurantId
      if (!restaurantId || isNaN(restaurantId)) {
        setError("Invalid restaurant ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${serverDomain}/api/menu-items/restaurant/${restaurantId}`);
        setMenuItems(response.data); // Set fetched menu items to state
      } catch (err) {
        setError(err.response ? err.response.data : "Error fetching menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  // Handle adding a new menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serverDomain}/api/menu-items`, { ...newMenuItem, restaurantId });
      setMenuItems([...menuItems, response.data]); // Update state with new menu item
      setNewMenuItem({ name: "", description: "", price: "", categoryId: "", available: true }); // Reset input fields
      setSuccessMessage("Menu item added successfully!");
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error adding menu item. Please try again.");
      console.error("Error adding menu item", err);
    }
  };

  // Prepare to edit a menu item
  const handleEditMenuItem = (menuItem) => {
    setEditingMenuItem(menuItem);
    setNewMenuItem({ name: menuItem.name, description: menuItem.description, price: menuItem.price, categoryId: menuItem.categoryId, available: menuItem.available });
  };

  // Handle updating an existing menu item
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    try {
      const response = await axios.put(`${serverDomain}/api/menu-items/${editingMenuItem.id}`, { ...newMenuItem, restaurantId });
      setMenuItems(menuItems.map(item => (item.id === editingMenuItem.id ? response.data : item))); // Update state with edited item
      setNewMenuItem({ name: "", description: "", price: "", categoryId: "", available: true }); // Reset input fields
      setEditingMenuItem(null); // Clear editing state
      setSuccessMessage("Menu item updated successfully!");
      setUpdateError(null);
    } catch (err) {
      setUpdateError("Error updating menu item. Please try again.");
      console.error("Error updating menu item", err);
    }
  };

  // Handle deleting a menu item
  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      await axios.delete(`${serverDomain}/api/menu-items/${menuItemId}`);
      setMenuItems(menuItems.filter(item => item.id !== menuItemId)); // Remove deleted item from state
      setSuccessMessage("Menu item deleted successfully!");
    } catch (err) {
      setUpdateError("Error deleting menu item. Please try again.");
      console.error("Error deleting menu item", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading menu items...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error.message ? error.message : "Error fetching menu items."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100">
      <header className="w-full bg-white">
        <div className="flex justify-between px-6 py-8 mx-auto max-w-7xl">
          <h1 className="text-5xl font-bold text-gray-900">Manage Menu Items</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          {updateError && <p className="text-red-500">{updateError}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          <h2 className="mb-6 text-3xl font-bold">Add New Menu Item</h2>
          <form onSubmit={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem}>
            <input
              type="text"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              placeholder="Name"
              className="mt-2 p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              value={newMenuItem.description}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              placeholder="Description"
              className="mt-2 p-2 border rounded w-full"
              required
            />
            <input
              type="number"
              value={newMenuItem.price}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
              placeholder="Price"
              className="mt-2 p-2 border rounded w-full"
              required
            />
            <input
              type="text"
              value={newMenuItem.categoryId}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, categoryId: e.target.value })}
              placeholder="Category ID"
              className="mt-2 p-2 border rounded w-full"
              required
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingMenuItem ? "Update Menu Item" : "Add Menu Item"}
              </button>
            </div>
          </form>

          <h2 className="mt-8 mb-6 text-3xl font-bold">Menu Item List</h2>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm text-gray-500">Price: ${item.price}</p>
                </div>
                <button
                  onClick={() => handleEditMenuItem(item)}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MenuItemManagementPage;
