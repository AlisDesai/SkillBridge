export default function MatchFilters({ activeFilter, setActiveFilter }) {
  const filterOptions = [
    { key: "all", label: "All Matches" },
    { key: "current", label: "Current Matches" },
    { key: "pending-sent", label: "Pending (Sent)" },
    { key: "pending-received", label: "Pending (Received)" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="bg-white shadow-sm rounded-2xl mb-6 p-4">
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setActiveFilter(option.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === option.key
                ? "bg-[#4A6FFF] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
