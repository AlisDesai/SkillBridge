import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../utils/api";
import { showSuccess, showError } from "../utils/toast";
import { loginUser } from "../redux/slices/authSlice";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/update-profile", form);
      showSuccess("Profile updated successfully");
      dispatch(loginUser({ email: form.email, password: form.password })); // Optional: re-sync auth
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
      <form
        className="bg-white shadow rounded-2xl p-6 space-y-4 max-w-2xl"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <textarea
          rows="4"
          placeholder="Short bio"
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[#4A6FFF] hover:bg-[#3b5dfc] text-white rounded-xl transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
