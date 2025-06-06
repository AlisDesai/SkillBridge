import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import { loginUser } from "../redux/slices/authSlice";

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
        setSkills(userData.skills || []);
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
      const res = await api.put("/users/update-profile", form);
      showSuccess("Profile updated successfully");
      dispatch(loginUser({ email: form.email, password: form.password }));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Profile</h2>
      <form
        className="bg-gray-800 shadow rounded-2xl p-6 space-y-4 max-w-2xl"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          rows="4"
          placeholder="Short bio"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-400 bg-gray-900 text-white"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

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
