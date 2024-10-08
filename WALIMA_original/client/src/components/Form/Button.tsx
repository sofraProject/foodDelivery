import React from "react";

interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className="w-full py-3 bg-primary text-white ring-gray-400 focus:outline-none focus:ring-4 mt-6 rounded-lg transition duration-300 poppins">
      {text}
    </button>
  );
};

export default Button;
