import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { showSuccess, showError } from "../../utils/toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });
      toast.success("Password Reset Successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Set New Password
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#FF7A59] hover:bg-[#e76745] text-white rounded-xl transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
