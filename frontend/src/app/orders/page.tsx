"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types/orderTypes'; // Importing the Order type for type safety

const Orders: React.FC = () => {
  const { isAuthenticated, user } = useAuth(); // Access authentication status and user details
  const [orders, setOrders] = useState<Order[]>([]); // State for storing user orders
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE; // Fetch server domain from environment variables

  // Fetch orders when the component mounts or authentication status changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false); // Exit if not authenticated
        return;
      }

      const url = `${serverDomain}/api/orders/byUser/${user.id}`; // Construct API URL for fetching orders
      console.log(`Fetching orders from: ${url}`); // Log the fetching URL
      try {
        const response = await axios.get(url); // Fetch orders from API
        console.log("API Response:", response.data); // Log the API response
        setOrders(response.data); // Set fetched orders to state
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        // Set error message based on API response or fallback
        setError(err.response ? err.response.data.message : "Failed to fetch orders");
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, serverDomain]); // Dependency array to refetch when auth state or user changes

  // Handle order cancellation
  const handleCancelOrder = async (orderId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/orders/${orderId}`); // DELETE request to cancel order
      setOrders(orders.filter(order => order.id !== orderId)); // Update state to remove canceled order
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order"); // Set error message on failure
    }
  };

  // Render loading and error states
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-warning text-center text-lg">{error}</div>; // Use warning color for error messages

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="border rounded-lg p-4 bg-secondary shadow-lg hover:shadow-xl transition transform hover:scale-105 relative"
            >
              <span className="absolute top-2 right-2 text-sm text-lightText">Order ID: #{order.id}</span>
              <h3 className="text-lg font-semibold mb-3 text-dark">Items:</h3>
              <ul className="list-disc pl-5 mb-3">
                {order.orderItems.map(item => (
                  <li key={item.id} className="text-dark">
                    <span className="font-medium text-success">{item.menuItem.name}</span> {/* Item name in success color */}
                    <span className="text-lightText ml-2 font-medium">({item.quantity})</span> {/* Quantity in light text color */}
                  </li>
                ))}
              </ul>
              <p className="font-medium mb-1">Status: <span className={`font-semibold text-${order.status === 'canceled' ? 'warning' : 'success'}-600`}>{order.status}</span></p>
              <p className="font-medium">Total Price: <span className="text-lg font-bold text-primary">${order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : 'N/A'}</span></p>
              {order.status === 'PENDING' && ( // Only show cancel button for pending orders
                <button 
                  onClick={() => handleCancelOrder(order.id)} 
                  className="absolute bottom-2 right-2 px-4 py-2 bg-warning text-white rounded-full hover:bg-red-700 transition transform hover:scale-105"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">No orders found.</p> // Message for no orders
      )}
    </div>
  );
};

export default Orders;
