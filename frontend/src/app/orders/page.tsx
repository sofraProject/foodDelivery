"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types/orderTypes';

const Orders: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      const url = `${serverDomain}/api/orders/byUser/${user.id}`;
      console.log(`Fetching orders from: ${url}`);
      try {
        const response = await axios.get(url);
        console.log("API Response:", response.data);
        setOrders(response.data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response ? err.response.data.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, serverDomain]);

  const handleCancelOrder = async (orderId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/orders/${orderId}`); // DELETE request to API
      setOrders(orders.filter(order => order.id !== orderId)); // Update state to remove the order
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Failed to cancel order");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transition transform hover:scale-105 relative">
              <span className="absolute top-2 right-2 text-sm text-gray-500">#{order.id}</span>
              <h3 className="text-md font-semibold mb-2">Items:</h3>
              <ul className="list-disc pl-5 mb-2">
                {order.orderItems.map(item => (
                  <li key={item.id} className="text-gray-700">
                    {item.menuItem.name}
                    <span className="text-gray-500 ml-2 font-medium">({item.quantity})</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium">Status: <span className={`text-${order.status === 'canceled' ? 'red' : 'green'}-600`}>{order.status}</span></p>
              <p className="font-medium">Total Price: <span className="text-lg font-bold">${order.totalPrice !== undefined ? order.totalPrice.toFixed(2) : 'N/A'}</span></p>
              {order.status === 'PENDING' && ( // Only show cancel button for pending orders
                <button 
                  onClick={() => handleCancelOrder(order.id)} 
                  className="absolute bottom-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
