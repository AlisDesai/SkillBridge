import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import { loginUser } from "../redux/slices/authSlice";
import EditProfile from "../components/profile/EditProfile";

export default function ProfilePage() {
  const dispatch = useDispatch();

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

        setSkills([
          ...(userData.teachSkills || []).map((s) => `${s.name} (${s.level})`),
          ...(userData.learnSkills || []).map((s) => `${s.name} (${s.level})`),
        ]);
      } catch (err) {
        showError("Failed to load user profile");
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/users/profile", form); // ✅ fixed endpoint
      showSuccess("Profile updated successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Profile</h2>

      <div className="bg-gray-800 shadow rounded-2xl p-6 max-w-2xl">
        <EditProfile
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      {skills.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow max-w-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-emerald-700 text-white px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
