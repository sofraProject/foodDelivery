
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types/orderTypes'; 

const Orders: React.FC = () => {
    const { isAuthenticated, decodedUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE;

    useEffect(() => {
        const fetchOrders = async () => {
            if (isAuthenticated && decodedUser?.id) {
                try {
                    const response = await axios.get(`${serverDomain}/api/orders/${decodedUser.id}`);
                    setOrders(response.data);
                } catch (err) {
                    setError("Failed to fetch orders");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, decodedUser, serverDomain]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id} className="border p-4 mb-2 rounded-lg shadow-sm">
                        <h2 className="font-semibold">Order ID: {order.id}</h2>
                        <p>Status: {order.status}</p>
                        <p>Total: ${order.total_amount}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Orders;
