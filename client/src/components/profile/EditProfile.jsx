// client/src/components/profile/EditProfile.jsx
import React from "react"; // Added React import
import Spinner from "../common/Spinner"; // Make sure Spinner is imported

export default function EditProfile({
  form,
  setForm,
  onSubmit,
  loading = false,
  theme = "light",
}) {
  const isDark = theme === "dark";

  const inputClasses = isDark
    ? "w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-700 text-white placeholder-gray-400 transition duration-200"
    : "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A6FFF] text-gray-900 placeholder-gray-500 transition duration-200";

  const labelClasses = isDark
    ? "block text-sm font-medium text-gray-300 mb-2"
    : "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-lg mx-auto">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your Full Name"
          className={inputClasses}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Your Email"
          className={`${inputClasses} cursor-not-allowed`}
          value={form.email}
          disabled // Email typically cannot be changed via profile edit
        />
      </div>

      {/* Location Input */}
      <div>
        <label htmlFor="location" className={labelClasses}>
          Location
        </label>
        <input
          id="location"
          type="text"
          placeholder="e.g., Surat, Gujarat"
          className={inputClasses}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>

      {/* Bio Textarea */}
      <div>
        <label htmlFor="bio" className={labelClasses}>
          Bio
        </label>
        <textarea
          id="bio"
          rows="5"
          placeholder="Tell us a little about yourself (e.g., your interests, goals, what you can offer/learn)."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className={inputClasses}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner size={20} color="#FFF" /> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
