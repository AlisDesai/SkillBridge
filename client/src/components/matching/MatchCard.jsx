// src/components/matching/MatchCard.jsx
export default function MatchCard({ user, onView }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#E5E7EB] overflow-hidden">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">
            {user.skill} · {user.level}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{user.bio}</p>
      <button
        className="mt-4 w-full bg-[#34D399] hover:bg-[#2dbb8b] text-white py-2 rounded-xl transition"
        onClick={() => onView?.(user)}
      >
        View Profile
      </button>
    </div>
  );
}
