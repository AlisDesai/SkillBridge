// client/src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import { loginUser } from "../redux/slices/authSlice";
import { setProfile, updateProfile } from "../redux/slices/userSlice"; // Import userSlice actions
import EditProfile from "../components/profile/EditProfile";
import ProfileCard from "../components/profile/ProfileCard"; // Import ProfileCard
import SkillList from "../components/profile/SkillList"; // Import SkillList

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user from auth slice
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
  });

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        const userData = res.data;

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
        });

        // Update Redux user profile with fetched data
        dispatch(setProfile(userData));

        setSkills([
          ...(userData.teachSkills || []).map((s) => ({
            name: s.name,
            level: s.level,
            type: "teach",
          })),
          ...(userData.learnSkills || []).map((s) => ({
            name: s.name,
            level: s.level,
            type: "learn",
          })),
        ]);
      } catch (err) {
        showError("Failed to load user profile");
      }
    };

    fetchUser();
  }, [dispatch]); // Add dispatch to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/profile", form);
      showSuccess("Profile updated successfully");
      dispatch(updateProfile(res.data)); // Update user in userSlice
      setIsEditing(false); // Exit editing mode after successful update
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-4xl font-extrabold text-white text-center mb-10">
          Your Profile
        </h2>

        {/* Profile Card Section */}
        {!isEditing ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-2xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <ProfileCard user={user} />
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-2xl rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Edit Your Details
            </h3>
            <EditProfile
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              loading={loading}
              theme="dark" // Pass theme prop
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-6 w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-emerald-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v2.104a1 1 0 01-.485.847L8 7.382V10h-2V6.757L4.707 5.464A1 1 0 004 4.757V2a1 1 0 011-1h6.3zM12 7a1 1 0 011-1h5a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V7a1 1 0 011-1h5a1 1 0 011 1v2.215l3.232-2.155A1 1 0 0012 7z"
                  clipRule="evenodd"
                />
              </svg>
              Your Skills
            </h3>
            <SkillList skills={skills} />
          </div>
        )}

        {/* Placeholder for other sections (e.g., reviews, matches) */}
        <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl text-center text-gray-400 text-lg">
          More profile sections coming soon!
        </div>
      </div>
    </div>
  );
}