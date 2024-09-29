'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types/orderTypes';

const Orders: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !serverDomain) {
        setLoading(false);
        return;
      }

      const url = `${serverDomain}/api/orders/`;
      console.log(`Fetching orders from: ${url}`);
      try {
        const response = await axios.get(url);
        setOrders(response.data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response ? err.response.data.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, serverDomain]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index} className="border p-4 mb-2 rounded-lg shadow-sm">
            <h2 className="font-semibold">Order Number: {index + 1}</h2>
            <p>Customer: {order.user.name}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total_amount}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <h3 className="font-semibold">Order Items:</h3>
            <ul>
              {order.orderItems.map((item) => (
                <li key={item.id} className="pl-4">
                  {item.quantity} x {item.menuItem.name} - ${item.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;




