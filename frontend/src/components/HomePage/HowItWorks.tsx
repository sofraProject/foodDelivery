"use client";
import React from "react";
import { FaSearch, FaTruck, FaUtensils } from "react-icons/fa";

const steps = [
  {
    icon: FaSearch,
    title: "Choose Your Food",
    description: "Browse our wide selection of delicious meals",
  },
  {
    icon: FaUtensils,
    title: "Place Your Order",
    description: "Customize your order and proceed to checkout",
  },
  {
    icon: FaTruck,
    title: "Pay your producti",
    description: "Enjoy your meal delivered right to your doorstep",
  },
  {
    icon: FaTruck,
    title: "Fast Delivery",
    description: "Enjoy your meal delivered right to your doorstep",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-block p-6 mb-4 bg-white rounded-full">
                <step.icon className="text-4xl text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
