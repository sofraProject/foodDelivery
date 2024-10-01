"use client";
import React from "react";
import { FaCreditCard, FaSearch, FaTruck, FaUtensils } from "react-icons/fa";

const steps = [
  {
    icon: FaSearch,
    title: "Choose Your Food",
    description: "Browse our wide selection \n of delicious meals",
  },
  {
    icon: FaUtensils,
    title: "Place Your Order",
    description: "Customize your order \n and proceed to checkout",
  },
  {
    icon: FaCreditCard,
    title: "Make a Payment",
    description: "Securely pay for your order \n using our payment methods",
  },
  {
    icon: FaTruck,
    title: "Fast Delivery",
    description: "Enjoy your meal delivered \n right to your doorstep",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-6 mb-4 rounded-full bg-primary">
                {/* Render the icon as a JSX component */}
                <step.icon className="text-4xl text-dark" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
