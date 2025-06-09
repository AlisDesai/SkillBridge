export default function EditProfile({
  form,
  setForm,
  onSubmit,
  loading = false,
  theme = "light",
}) {
  const isDark = theme === "dark";

  const inputClasses = isDark
    ? "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
    : "w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]";

  const labelClasses = isDark
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      {/* Name Input */}
      <div>
        <label className={labelClasses}>Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          className={inputClasses}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Email Input */}
      <div>
        <label className={labelClasses}>Email</label>
        <input
          type="email"
          placeholder="Email"
          className={inputClasses}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled
        />
      </div>

      {/* Location Input */}
      <div>
        <label className={labelClasses}>Location</label>
        <input
          type="text"
          placeholder="Location"
          className={inputClasses}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>

      {/* Bio Textarea */}
      <div>
        <label className={labelClasses}>Bio</label>
        <textarea
          rows="4"
          placeholder="Short bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className={inputClasses}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
