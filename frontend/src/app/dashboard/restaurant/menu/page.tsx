"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const serverDomain =
  process.env.NEXT_PUBLIC_SERVER_DOMAINE || "http://localhost:3000"; // Provide a default value

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${serverDomain}/api/users/customers/get`);
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching customers.");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await axios.delete(`${serverDomain}/api/users/customers/${customerId}`);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
    } catch (error) {
      console.error("Error deleting customer", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading customers...</p>
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
          <h1 className="text-5xl font-bold text-gray-900">Manage Customers</h1>
        </div>
      </header>

      <main className="flex flex-col flex-grow mx-auto max-w-7xl">
        <section className="p-6">
          <h2 className="mb-6 text-3xl font-bold">Customer List</h2>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
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

export default CustomerManagementPage;