import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../common/Spinner";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    const res = await dispatch(registerUser(payload));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#34D399]"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34D399]"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34D399]"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34D399]"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full py-2 bg-[#34D399] hover:bg-[#2fc08b] text-white rounded-xl transition"
      >
        {loading ? <Spinner size="sm" /> : "Sign Up"}
      </button>
    </form>
  );
}
