
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const serverDomain = process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000";

const FactureComponent = () => {
  const { orderId } = useParams(); // Assuming orderId is passed in the URL
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/orders/order-items/order/${orderId}`);
        setOrderItems(response.data);
      } catch (err) {
        setError("Error fetching order items.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId]);

  if (loading) {
    return <p>Loading order items...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Facture</h1>
      <table className="mt-4 w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Menu Item</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.menuItem.name}</td>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Total: ${orderItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default FactureComponent;
