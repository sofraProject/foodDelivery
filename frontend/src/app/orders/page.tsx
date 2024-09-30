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

      const url = `${serverDomain}/api/orders/byUser/${user.id}`; // Adjust API endpoint as needed
      console.log(`Fetching orders from: ${url}`);
      try {
        const response = await axios.get(url);
        setOrders(response.data); // Set fetched orders
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response ? err.response.data.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, serverDomain]);

  const handleCancelOrder = (orderId: number) => {
    // Here you can implement the cancellation logic
    console.log(`Order ${orderId} cancelled`);
    setOrders(orders.filter(order => order.id !== orderId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 mt-24">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="border p-4 mb-2">
              <h2>Order ID: {order.id}</h2>
              <p>Status: {order.status}</p>
              <p>Total Price: ${order.total_amount}</p>
              <button 
                onClick={() => handleCancelOrder(order.id)} 
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Cancel Order
              </button>            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
