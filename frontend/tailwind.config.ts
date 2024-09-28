/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the files Tailwind should scan for class usage
  content: ["./src/**/*.{html,js,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#FFB700", // Glovo yellow
        secondary: "#FFFFFF", // White for backgrounds
        accent: "#9BBB4F", // Orange accents (buttons)
        neutral: "#F2F2F2", // Light background for sections
        darkText: "#2E2E2E", // Dark text for readability
        lightText: "#717171", // Light gray for secondary text
        success: "#34C759", // Green for positive elements
        warning: "#FF3B30", // Red for alerts or warnings
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Clean modern font similar to what is used in Glovo design
        display: ["Poppins", "sans-serif"], // For larger, bolder text
      },
      borderRadius: {
        lg: "1rem", // More rounded corners for buttons and cards
        xl: "1.5rem", // Extra rounded for larger elements
      },
      spacing: {
        "18": "4.5rem", // Extra spacing option for padding/margins
        "22": "5.5rem", // Custom spacing
      },
      boxShadow: {
        card: "0px 10px 30px rgba(0, 0, 0, 0.05)", // Soft shadow for card-like elements
      },
    },
  },

  // ==============================
  // Custom Variants and Plugins
  // ==============================
  variants: {
    extend: {
      backgroundColor: ["active", "disabled"], // Adds active and disabled states for background color
      opacity: ["disabled"], // Controls opacity for disabled elements
    },
  },

  // plugins: [
  //   require("@tailwindcss/forms"), // Better form styling plugin
  //   require("@tailwindcss/typography"), // Enhanced typography for text-heavy pages
  //   require("@tailwindcss/aspect-ratio"), // Aspect-ratio utilities for image or video containers
  // ],
};
