import { useState } from "react";

const Spinner = ({ size }) => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

const SuccessMessage = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Text */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Registration Successful! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Welcome to our community! Redirecting you to your dashboard...
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulate navigation (replace with actual navigation in your app)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In your actual app, use: navigate(path) from react-router-dom
    // For demonstration purposes, we'll simulate direct redirect
    if (path === "/login") {
      // Direct redirect to login page without any popup
      window.location.href = "/login"; // Replace with your actual routing logic
    } else if (path === "/home" || path === "/dashboard") {
      // Direct redirect to home/dashboard page without any popup
      window.location.href = "/dashboard"; // Replace with your actual routing logic
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Simulated registration logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      setShowSuccess(true);

      // Reset form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to dashboard after 2 seconds (enough time to see success message)
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard"); // Direct redirect to dashboard
      }, 2000);
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 flex items-center justify-center p-6">
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/6 w-56 h-56 bg-teal-300/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-cyan-300/6 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl w-full">
          {/* Subtle outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/12 via-teal-400/10 to-cyan-400/8 rounded-3xl blur-xl animate-pulse"></div>

          {/* Main horizontal container */}
          <div className="relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-white/60 dark:border-gray-700/60 rounded-3xl shadow-xl hover:shadow-emerald-500/15 transition-all duration-500 overflow-hidden">
            {/* Two-column layout */}
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left side - Welcome section */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-12 flex flex-col justify-center items-center text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/8 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>

                <style jsx>{`
                  @keyframes float {
                    0%,
                    100% {
                      transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                      transform: translateY(-20px) rotate(5deg);
                    }
                  }
                  .animate-float {
                    animation: float 6s ease-in-out infinite;
                  }
                `}</style>

                {/* Welcome content */}
                <div className="relative text-center z-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 shadow-lg backdrop-blur-sm animate-float">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>

                  <h1 className="text-5xl font-bold mb-4 leading-tight">
                    Join Our
                    <br />
                    <span className="text-white/90">Community</span>
                  </h1>

                  <p className="text-xl text-white/80 mb-6 leading-relaxed">
                    Connect with thousands of users worldwide and start your
                    journey with us today.
                  </p>

                  <div className="flex justify-center space-x-2 mb-8">
                    <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-white/40 rounded-full animate-pulse delay-200"></div>
                    <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse delay-500"></div>
                  </div>

                  <div className="text-sm text-white/70">
                    <p>✨ Free to join</p>
                    <p>🔒 Secure & Private</p>
                    <p>🌟 Premium Features</p>
                  </div>
                </div>
              </div>

              {/* Right side - Form section */}
              <div className="p-12 flex flex-col justify-center">
                {/* Refined decorative elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-emerald-400/15 to-teal-400/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-8 right-12 w-12 h-12 bg-gradient-to-br from-cyan-400/10 to-emerald-400/15 rounded-full blur-lg animate-pulse delay-1000"></div>

                <div className="relative space-y-8 max-w-md mx-auto w-full">
                  {/* Form header */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                      Create Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Fill in your details below
                    </p>
                  </div>

                  {/* Form fields - Horizontal pairs */}
                  <div className="space-y-6">
                    {/* Name field */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/8 to-teal-400/6 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="relative w-full px-6 py-4 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl bg-white/98 dark:bg-gray-800/98 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/60 transition-all duration-300 text-base shadow-sm hover:shadow-lg font-medium"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    {/* Email field */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/8 to-cyan-400/6 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="relative w-full px-6 py-4 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl bg-white/98 dark:bg-gray-800/98 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400/60 transition-all duration-300 text-base shadow-sm hover:shadow-lg font-medium"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>

                    {/* Password fields in horizontal layout */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/8 to-emerald-400/6 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="password"
                          placeholder="Password"
                          className="relative w-full px-4 py-4 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl bg-white/98 dark:bg-gray-800/98 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/60 transition-all duration-300 text-base shadow-sm hover:shadow-lg font-medium"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                        />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/8 via-teal-400/6 to-cyan-400/8 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          className="relative w-full px-4 py-4 border border-gray-200/80 dark:border-gray-600/80 rounded-2xl bg-white/98 dark:bg-gray-800/98 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/60 transition-all duration-300 text-base shadow-sm hover:shadow-lg font-medium"
                          value={form.confirmPassword}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      disabled={loading}
                      className="relative w-full py-4 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Spinner size="sm" />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>Create Account</span>
                            <svg
                              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Already have account link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600 dark:text-gray-300 text-base">
                      Already have an account?{" "}
                      <button
                        onClick={() => navigate("/login")}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-colors duration-200 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message Modal */}
      <SuccessMessage show={showSuccess} />
    </>
  );
}
