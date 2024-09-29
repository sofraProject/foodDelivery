'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/features/orderSlice';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Order } from '../../types/orderTypes'; // Assuming you have an Order type defined

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN; // Correction ici pour être cohérent

  useEffect(() => {
    dispatch(fetchOrders() as any);
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleViewOrder = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/orders/${orderId}`);
      dispatch(fetchOrders() as any); // Fetch updated orders after deletion
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Orders List</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => ( // Use Order type
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.user_id}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">${order.total_amount}</td>
                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-blue-500" onClick={() => handleViewOrder(order.id)}>View</button>
                  <button className="text-red-500 ml-2" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
