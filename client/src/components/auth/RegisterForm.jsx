import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Mock components for demonstration
const Spinner = ({ size }) => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
);

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Correctly initializing navigate here!

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("User registered:", { name: form.name, email: form.email });

      // Show toast
      toast.success("Registration successful! 🎉");

      // Redirect to HomePage
      navigate("/", { replace: true });
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 rounded-3xl opacity-60 blur-xl"></div>

      {/* Glass morphism background */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl"></div>

        <form className="relative space-y-6" onSubmit={handleSubmit}>
          <style jsx>{`
            @keyframes gradient-x {
              0%,
              100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            .animate-gradient-x {
              background-size: 200% 200%;
              animation: gradient-x 3s ease infinite;
            }
          `}</style>
          {/* Form header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join us and start your journey
            </p>
          </div>

          {/* Input fields */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            <input
              type="text"
              placeholder="Full Name"
              className="relative w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            <input
              type="email"
              placeholder="Email"
              className="relative text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            <input
              type="password"
              placeholder="Password"
              className="relative bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="relative text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 w-full px-6 py-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <div className="relative group pt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 via-cyan-400 to-emerald-500 rounded-3xl opacity-75 group-hover:opacity-100 transition-all duration-500 blur-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-300 rounded-3xl opacity-0 group-hover:opacity-60 transition-all duration-700 blur-xl scale-110"></div>
            <div className="relative p-0.5 bg-gradient-to-r from-emerald-400 via-teal-500 via-cyan-400 to-emerald-500 rounded-3xl animate-gradient-x">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-5 px-8 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white font-bold text-lg rounded-3xl transition-all duration-500 transform hover:scale-[1.03] active:scale-[0.97] shadow-2xl hover:shadow-emerald-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <Spinner size="sm" />
                      <span className="font-semibold">Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 text-white/90 group-hover:text-white transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold tracking-wide">
                        Create My Account
                      </span>
                      <div className="relative overflow-hidden">
                        <svg
                          className="w-6 h-6 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
        </form>
      </div>
    </div>
  );
}
