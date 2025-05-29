import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6FFF]"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6FFF]"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <div className="flex justify-end text-sm">
        <a href="/forgot-password" className="text-[#4A6FFF] hover:underline">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-[#4A6FFF] hover:bg-[#3b5dfc] text-white rounded-xl transition"
      >
        {loading ? <Spinner size="sm" /> : "Sign In"}
      </button>
    </form>
  );
}
