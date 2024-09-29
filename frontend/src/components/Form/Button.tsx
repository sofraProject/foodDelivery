"use client";
import React from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void; // Correction du type de onClick
  disabled?: boolean; // Correction du type de onClick
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  text,
  className,
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-3 mt-6 font-bold transition duration-300 rounded-lg bg-primary text-dark ring-gray-400 focus:outline-none focus:ring-4 poppins ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
