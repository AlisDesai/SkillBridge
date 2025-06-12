import { useState } from "react";
import { useNavigate } from "react-router-dom";

const floatKeyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
  }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient { 
    background-size: 200% 200%;
    animation: gradient-shift 4s ease infinite;
  }
  
  /* Ensure full coverage */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #0c0a09 !important;
    min-height: 100vh !important;
  }
`;

const Spinner = ({ size }) => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm">
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

const SuccessMessage = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300 border border-gray-700">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
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

          <h3 className="text-2xl font-bold text-white mb-2">
            Welcome Back! 🎉
          </h3>
          <p className="text-gray-300 mb-6">
            Login successful! Redirecting to your{" "}
            {data?.user?.role === "admin" ? "admin" : ""} dashboard...
          </p>

          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>

          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Invalid email format";
        } else if (value.length > 254) {
          error = "Email is too long";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Must be at least 6 characters";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token or user info to localStorage or Redux
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setShowSuccess(true);
      setForm({ email: "", password: "" });
      setErrors({});
      setTouched({});

      setTimeout(() => {
        setShowSuccess(false);
        // Check if user is admin and redirect accordingly
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err) {
      setErrors({ submit: "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "relative w-full px-6 py-4 border rounded-2xl bg-gray-800/60 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-base shadow-lg font-medium";
    const hasError = errors[fieldName] && touched[fieldName];

    if (hasError) {
      return `${baseClass} border-red-500/60 focus:ring-2 focus:ring-red-500/40 focus:border-red-500/80`;
    }

    return `${baseClass} border-gray-700 hover:border-emerald-300/50 focus:ring-2 focus:ring-emerald-300/40 focus:border-emerald-300/60 hover:bg-gray-800/80`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatKeyframes }} />

      {/* Full screen container with sophisticated dark gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-neutral-900 to-stone-900 overflow-auto">
        <div className="min-h-screen flex items-center justify-center p-6">
          {/* Elegant animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-emerald-600/10 to-teal-500/8 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/6 w-64 h-64 bg-gradient-to-r from-emerald-400/8 to-emerald-600/6 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-gradient-to-r from-teal-500/6 to-emerald-300/8 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-300/5 to-emerald-400/7 rounded-full blur-2xl animate-pulse delay-3000"></div>
          </div>

          <div className="relative max-w-6xl w-full z-10">
            {/* Sophisticated outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-teal-500/8 to-emerald-400/6 rounded-3xl blur-2xl animate-pulse-glow opacity-50"></div>

            {/* Main container with refined styling */}
            <div className="relative backdrop-blur-lg bg-gray-900/95 border border-gray-700/80 rounded-3xl shadow-2xl hover:shadow-emerald-600/20 transition-all duration-700 overflow-hidden">
              {/* Two-column layout */}
              <div className="grid lg:grid-cols-2 min-h-[700px]">
                {/* Left side - Enhanced welcome section */}
                <div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-600 animate-gradient p-16 flex flex-col justify-center items-center text-white overflow-hidden">
                  {/* Sophisticated decorative elements */}
                  <div className="absolute top-12 right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-12 left-12 w-28 h-28 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
                  <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/12 rounded-full blur-lg animate-pulse delay-1500"></div>

                  {/* Enhanced welcome content */}
                  <div className="relative text-center z-10">
                    <div className="inline-flex items-center justify-center w-28 h-28 bg-white/20 rounded-3xl mb-10 shadow-2xl backdrop-blur-sm animate-float border border-white/30">
                      <svg
                        className="w-14 h-14 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>

                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                      Welcome
                      <br />
                      <span className="text-white/90 text-5xl">Back!</span>
                    </h1>

                    <p className="text-xl text-white/85 mb-10 leading-relaxed max-w-md">
                      Step into your secure digital workspace. Your journey
                      continues here with enhanced security and premium
                      features.
                    </p>

                    <div className="flex justify-center space-x-3 mb-10">
                      <div className="w-5 h-5 bg-white/70 rounded-full animate-pulse"></div>
                      <div className="w-5 h-5 bg-white/50 rounded-full animate-pulse delay-200"></div>
                      <div className="w-5 h-5 bg-white/70 rounded-full animate-pulse delay-500"></div>
                    </div>

                    <div className="space-y-3 text-white/80">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                        <p className="text-lg">🛡️ Enterprise-grade Security</p>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <p className="text-lg">⚡ Lightning-fast Access</p>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                        <p className="text-lg">
                          ✨ Premium Dashboard Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Enhanced form section */}
                <div className="bg-gray-900/98 p-16 flex flex-col justify-center relative">
                  {/* Refined decorative elements */}
                  <div className="absolute top-12 right-12 w-20 h-20 bg-gradient-to-br from-emerald-600/20 to-teal-500/15 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-12 right-16 w-16 h-16 bg-gradient-to-br from-teal-500/15 to-emerald-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-8 w-12 h-12 bg-gradient-to-br from-emerald-300/10 to-emerald-600/15 rounded-full blur-md animate-pulse delay-2000"></div>

                  <div className="relative space-y-10 max-w-md mx-auto w-full">
                    {/* Enhanced form header */}
                    <div className="text-center">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-3">
                        Sign In
                      </h2>
                      <p className="text-gray-300 text-lg">
                        Access your secure dashboard
                      </p>
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full mx-auto mt-4"></div>
                    </div>

                    {/* Enhanced error message */}
                    {errors.submit && (
                      <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-5 backdrop-blur-sm">
                        <ErrorMessage message={errors.submit} />
                      </div>
                    )}

                    {/* Enhanced form fields */}
                    <div className="space-y-8">
                      {/* Email field with enhanced styling */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-500/8 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-emerald-300 transition-colors duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              />
                            </svg>
                          </div>
                          <input
                            type="email"
                            placeholder="Email Address"
                            className={`${getInputClassName("email")} pl-14`}
                            value={form.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            onBlur={() => handleInputBlur("email")}
                            disabled={loading}
                            autoComplete="email"
                          />
                        </div>
                        <ErrorMessage
                          message={touched.email ? errors.email : ""}
                        />
                      </div>

                      {/* Password field with enhanced styling */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-600/8 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-emerald-300 transition-colors duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <input
                            type="password"
                            placeholder="Password"
                            className={`${getInputClassName("password")} pl-14`}
                            value={form.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            onBlur={() => handleInputBlur("password")}
                            disabled={loading}
                            autoComplete="current-password"
                          />
                        </div>
                        <ErrorMessage
                          message={touched.password ? errors.password : ""}
                        />
                      </div>

                      {/* Enhanced forgot password link */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => navigate("/forgot-password")}
                          className="text-slate-300 hover:text-emerald-300 font-medium transition-all duration-300 hover:underline text-sm relative group"
                          disabled={loading}
                        >
                          <span className="relative z-10">
                            Forgot password?
                          </span>
                          <div className="absolute inset-0 bg-emerald-300/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced submit button */}
                    <div className="pt-6">
                      <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={loading}
                        className="relative w-full py-5 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-emerald-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          {loading ? (
                            <div className="flex items-center space-x-3">
                              <Spinner size="sm" />
                              <span>Signing In...</span>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                              </svg>
                              <span>Sign In</span>
                              <svg
                                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
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

                    {/* Enhanced create account link */}
                    <div className="text-center pt-6">
                      <p className="text-gray-300 text-base">
                        Don't have an account?{" "}
                        <button
                          onClick={() => navigate("/register")}
                          className="text-slate-300 hover:text-emerald-300 font-bold transition-all duration-300 hover:underline relative group"
                        >
                          <span className="relative z-10">Create Account</span>
                          <div className="absolute inset-0 bg-emerald-300/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        </button>
                      </p>
                    </div>

                    {/* Enhanced social login options */}
                    <div className="pt-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-6 bg-gray-900 text-gray-400 font-medium">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          className="group w-full inline-flex justify-center items-center py-4 px-6 rounded-2xl bg-gray-800 border border-gray-700 text-sm font-medium text-slate-300 hover:text-emerald-300 hover:bg-gray-800/80 hover:border-emerald-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-emerald-600/20"
                          disabled={loading}
                        >
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Google</span>
                        </button>

                        <button
                          type="button"
                          className="group w-full inline-flex justify-center items-center py-4 px-6 rounded-2xl bg-gray-800 border border-gray-700 text-sm font-medium text-slate-300 hover:text-emerald-300 hover:bg-gray-800/80 hover:border-emerald-300/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-emerald-600/20"
                          disabled={loading}
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span>Facebook</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessMessage show={showSuccess} />
    </>
  );
}
