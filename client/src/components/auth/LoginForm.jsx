import { useState } from "react";

const Spinner = ({ size }) => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 mt-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
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

const SuccessMessage = ({ show, userRole }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-950/95 via-slate-950/95 to-black/95 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300 border border-emerald-400/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-teal-600/5 animate-pulse"></div>
        <div className="text-center relative z-10">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-2xl shadow-emerald-500/50 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 blur-xl opacity-60 animate-pulse"></div>
            <svg
              className="w-10 h-10 text-white relative z-10"
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

          <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-3">
            Welcome Back! 🎉
          </h3>
          <p className="text-slate-300 mb-8 text-lg">
            Login successful! Redirecting to your{" "}
            {userRole === "admin" ? "admin" : ""} dashboard...
          </p>

          <div className="w-full bg-gray-800/50 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 h-3 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"
              style={{ width: "100%" }}
            ></div>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100 shadow-lg shadow-green-500/50"></div>
            <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce delay-200 shadow-lg shadow-teal-600/50"></div>
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
  const [userRole, setUserRole] = useState("");
  const [touched, setTouched] = useState({});

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    window.location.href = path;
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Invalid email format";
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
    if (e) e.preventDefault();

    setTouched({ email: true, password: true });

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUserRole(data.user.role);
      setShowSuccess(true);
      setForm({ email: "", password: "" });
      setErrors({});
      setTouched({});

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }, 200);
    } catch (err) {
      setErrors({ submit: "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-4 bg-gray-800/70 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 text-base font-medium shadow-md";
    const hasError = errors[fieldName] && touched[fieldName];

    if (hasError) {
      return `${baseClass} border-red-500/60 focus:ring-2 focus:ring-red-500/20 focus:border-red-400/80`;
    }

    return `${baseClass} border-slate-500/40 hover:border-emerald-400/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/70 hover:bg-gray-800/80`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-96 -right-96 w-[700px] h-[700px] bg-emerald-400/6 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-96 -left-96 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-400/3 rounded-full blur-3xl"></div>

          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/4 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-400/3 rounded-full blur-2xl"></div>

          <div className="absolute top-32 left-40 w-2 h-2 bg-emerald-400/50 rounded-full animate-pulse"></div>
          <div className="absolute top-48 right-40 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-teal-500/45 rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-72 right-1/4 w-1 h-1 bg-emerald-300/35 rounded-full animate-pulse delay-300"></div>

          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(52, 211, 153, 0.08) 1px, transparent 0)`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>
        </div>

        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 min-h-[630px] shadow-2xl rounded-2xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-l-2xl lg:rounded-r-none rounded-r-2xl lg:rounded-br-none p-14 flex flex-col justify-center items-center text-white overflow-hidden">
              <div className="absolute top-8 right-8 w-24 h-24 bg-white/8 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/6 rounded-full blur-lg"></div>
              <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-white/4 rounded-full blur-2xl"></div>
              <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>

              <div className="relative text-center z-10 max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 shadow-xl backdrop-blur-sm border border-white/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/8 to-white/4 rounded-3xl"></div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-300/15 via-green-400/15 to-teal-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <svg
                    className="w-10 h-10 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>

                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  Welcome Back to
                  <br />
                  <span className="text-white/95 text-5xl bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                    SkillBridge
                  </span>
                </h1>

                <p className="text-lg text-white/90 mb-8 leading-relaxed font-medium">
                  Continue your journey of learning and growth. Your
                  personalized dashboard awaits with new opportunities and
                  endless possibilities.
                </p>

                <div className="flex justify-center space-x-3 mb-8">
                  <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg shadow-white/20"></div>
                  <div className="w-4 h-4 bg-white/60 rounded-full shadow-lg shadow-white/20"></div>
                  <div className="w-4 h-4 bg-white/80 rounded-full shadow-lg shadow-white/20"></div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/15 rounded-full backdrop-blur-sm border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/90 font-medium">
                      🔒 Enterprise-Grade Security
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/15 rounded-full backdrop-blur-sm border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/90 font-medium">
                      ⚡ Lightning-Fast Performance
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-white/15 rounded-full backdrop-blur-sm border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <p className="text-white/90 font-medium">
                      🌟 Premium Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-950/98 via-slate-950/98 to-gray-900/98 backdrop-blur-xl rounded-r-2xl lg:rounded-l-none rounded-l-2xl lg:rounded-bl-none p-14 flex flex-col justify-center border border-slate-500/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/2 via-green-500/1 to-teal-600/2"></div>
              <div className="max-w-md mx-auto w-full space-y-7 relative z-10">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent mb-2 relative">
                    Sign In
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full"></div>
                  </h2>
                  <p className="text-slate-300 text-lg font-medium">
                    Access your secure account
                  </p>
                </div>

                {errors.submit && (
                  <div className="bg-gradient-to-r from-red-900/40 to-red-800/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm shadow-lg shadow-red-500/20">
                    <ErrorMessage message={errors.submit} />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-200 tracking-wide">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-emerald-500/8 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300">
                        <svg
                          className="w-5 h-5"
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
                        placeholder="Enter your email address"
                        className={`${getInputClassName(
                          "email"
                        )} pl-12 py-4 text-base hover:border-emerald-400/50 focus:border-emerald-400/70`}
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleInputBlur("email")}
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                    <ErrorMessage message={touched.email ? errors.email : ""} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-200 tracking-wide">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-green-500/8 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-green-400 transition-colors duration-300">
                        <svg
                          className="w-5 h-5"
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
                        placeholder="Enter your password"
                        className={`${getInputClassName(
                          "password"
                        )} pl-12 py-4 text-base`}
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

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="relative w-full py-4 px-8 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold text-base rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Spinner size="sm" />
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
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
                            className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
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

                  <div className="text-center pt-6">
                    <p className="text-slate-300 text-base font-medium">
                      Don't have an account?{" "}
                      <button
                        onClick={() => navigate("/register")}
                        className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 font-bold transition-colors duration-200 hover:underline"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessMessage show={showSuccess} userRole={userRole} />
    </>
  );
}
