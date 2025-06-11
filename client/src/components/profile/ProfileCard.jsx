// client/src/components/profile/ProfileCard.jsx
import React from "react"; // Added React import

export default function ProfileCard({ user }) {
  const avatarPlaceholder =
    "https://via.placeholder.com/150/4A6FFF/FFFFFF?text=AV"; // Attractive placeholder

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center max-w-sm w-full transform transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="relative mb-6">
        <img
          src={user?.avatar || avatarPlaceholder} // Use user avatar if available
          alt="User Avatar"
          className="h-28 w-28 rounded-full object-cover border-4 border-emerald-500 shadow-md"
        />
        {/* You can add an online status indicator here if needed */}
      </div>
      <h3 className="text-3xl font-extrabold text-gray-900 mb-2">
        {user?.name || "Full Name"}
      </h3>
      <p className="text-md text-gray-600 mb-2">
        {user?.email || "email@example.com"}
      </p>
      {user?.location && (
        <p className="text-md text-gray-600 flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {user.location}
        </p>
      )}
      <p className="text-gray-700 text-base italic leading-relaxed mt-4 border-t pt-4 border-gray-200">
        "{user?.bio || "A brief and inspiring bio about the user..."}"
      </p>
    </div>
  );
}
