// client/src/components/common/Input.jsx
import React from "react"; // Added React import

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  className = "",
  disabled = false, // Added disabled prop
  readOnly = false, // Added readOnly prop
  required = false, // Added required prop
}) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6FFF] transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${className}`}
      />
    </div>
  );
}
