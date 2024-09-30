"use client";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import "../../styles/tailwind.css";
const Brand: React.FC = () => {
  return (
    <div className="justify-center text-center">
      <Image className="w-52" src={logo} alt="logo" />
    </div>
  );
};

export default Brand;
