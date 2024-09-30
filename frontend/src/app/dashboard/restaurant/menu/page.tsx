"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const serverDomain =
  process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000"; // Provide a default value

const MenuItemManagementPage = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "", price: "", categoryId: "", available: true });
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/menu-items`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching menu items.");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddMenuItem = async () => {
    try {
      const response = await axios.post(`${serverDomain}/api/menu-items`, newMenuItem);
      setMenuItems([...menuItems, response.data]);
      setNewMenuItem({ name: "", description: "", price: "", categoryId: "", available: true });
    } catch (error) {
      console.error("Error adding menu item", error);
    }
  };

  const handleEditMenuItem = (menuItem: any) => {
    setEditingMenuItem(menuItem);
    setNewMenuItem({ name: menuItem.name, description: menuItem.description, price: menuItem.price, categoryId: menuItem.categoryId, available: menuItem.available });
  };

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem) return;

    try {
      const response = await axios.put(`${serverDomain}/api/menu-items/${editingMenuItem.id}`, newMenuItem);
      setMenuItems(menuItems.map(item => (item.id === editingMenuItem.id ? response.data : item)));
      setNewMenuItem({ name: "", description: "", price: "", categoryId: "", available: true });
      setEditingMenuItem(null);
    } catch (error) {
      console.error("Error updating menu item", error);
    }
  };

  const handleDeleteMenuItem = async (menuItemId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/menu-items/${menuItemId}`);
      setMenuItems(menuItems.filter(item => item.id !== menuItemId));
    } catch (error) {
      console.error("Error deleting menu item", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
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
          <h2 className="mb-6 text-3xl font-bold">Menu Item List</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">Add New Menu Item</h3>
            <input
              type="text"
              placeholder="Name"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newMenuItem.description}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newMenuItem.price}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
              className="block w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category ID"
              value={newMenuItem.categoryId}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, categoryId: e.target.value })}
              className="block w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {editingMenuItem ? "Update Menu Item" : "Add Menu Item"}
            </button>
          </div>

          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md"
              >
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
