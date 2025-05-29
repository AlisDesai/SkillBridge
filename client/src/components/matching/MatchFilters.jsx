export default function MatchFilters({ filters, setFilters }) {
  return (
    <div className="bg-white shadow p-4 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
      >
        <option value="">All Categories</option>
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="marketing">Marketing</option>
      </select>

      <select
        value={filters.level}
        onChange={(e) => setFilters({ ...filters, level: e.target.value })}
        className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
      >
        <option value="">All Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <input
        type="text"
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
      />

      <button
        onClick={() => setFilters({ category: "", level: "", location: "" })}
        className="bg-[#EF4444] text-white rounded-xl px-4 py-2 hover:bg-red-600"
      >
        Clear Filters
      </button>
    </div>
  );
}
