"use client";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Brand from "../Form/Brand";

// Define types for links
interface FooterLink {
  id: number;
  text: string;
  path?: string;
}

// Footer Links Data
const footerLinks: FooterLink[] = [
  { id: 1, text: "About Online Food" },
  { id: 2, text: "Read our blog" },
  { id: 3, text: "Sign up to deliver" },
  { id: 4, text: "Add your restaurant" },
  { id: 5, text: "Get Help" },
  { id: 6, text: "Ask any question" },
  { id: 7, text: "Order Now" },
  { id: 8, text: "Contact", path: "/contact" },
];

// Social Icons Data
const socialIcons = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaTwitter, label: "Twitter" },
  { Icon: FaYoutube, label: "YouTube" },
];

const BottomFooter: React.FC = () => (
  <div className="flex flex-col items-center px-4 py-3 space-y-2 text-center text-gray-300">
    {/* Branding with Heart Icon */}
    <div className="flex items-center space-x-2 text-sm">
      <span className="font-semibold">Developed with </span>
      <FaHeart className="text-red-500" aria-label="Heart" />
    </div>

    {/* Legal Links */}
    <div className="flex space-x-4">
      {["Privacy Policy", "Terms of Use", "Pricing"].map((link, index) => (
        <span
          key={index}
          className="text-xs transition-colors cursor-pointer hover:text-gray-500"
        >
          {link}
        </span>
      ))}
    </div>
  </div>
);

const MainFooter: React.FC = () => (
  <div className="px-4 py-6 space-y-6 text-center text-gray-300 bg-gray-800">
    {/* Brand Logo */}
    <div></div>

    {/* Footer Links in a Responsive Grid */}
    <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3 lg:grid-cols-4">
      {footerLinks.map(({ id, text, path }) =>
        path ? (
          <Link
            key={id}
            href={path}
            className="transition-colors hover:text-gray-500"
          >
            {text}
          </Link>
        ) : (
          <span
            key={id}
            className="transition-colors cursor-pointer hover:text-gray-500"
          >
            {text}
          </span>
        )
      )}
    </div>

    {/* Social Media Icons */}
    <div className="flex justify-center space-x-6">
      {socialIcons.map(({ Icon, label }, idx) => (
        <Icon
          key={idx}
          className="text-2xl transition-transform transform cursor-pointer hover:scale-110 hover:text-gray-500"
          aria-label={label}
        />
      ))}
    </div>

    {/* Divider Line */}
    <div className="w-full border-t border-gray-600"></div>
  </div>
);

const Footer: React.FC = () => (
  <footer className="justify-center py-12 text-center text-gray-300 bg-gray-800 ">
    <div className="container justify-center px-4 mx-auto text-center">
      <Brand />
      <MainFooter />
      <BottomFooter />
    </div>
  </footer>
);

export default Footer;
