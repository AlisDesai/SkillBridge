// client/src/components/common/Button.jsx
import React from "react"; // Added React import

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false, // Added disabled prop
}) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#4A6FFF] text-white hover:bg-[#3b5dfc] shadow-lg",
    secondary: "bg-[#34D399] text-white hover:bg-[#2dbb8b] shadow-lg",
    danger: "bg-[#EF4444] text-white hover:bg-red-600 shadow-lg",
    outline:
      "border-2 border-[#4A6FFF] text-[#4A6FFF] hover:bg-[#EEF2FF] hover:text-[#3b5dfc]",
    dark: "bg-gray-700 text-white hover:bg-gray-600 shadow-lg", // New dark variant
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} // Apply disabled prop
      className={`${baseStyles} ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </button>
  );
}
