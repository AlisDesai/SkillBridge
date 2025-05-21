export default function ProfileCard({ user }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-[#E5E7EB]" />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user?.name || "Full Name"}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.email || "email@example.com"}
          </p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-4">
        {user?.bio || "A brief bio about the user..."}
      </p>
    </div>
  );
}
