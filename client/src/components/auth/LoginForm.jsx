import { useState } from "react";

const floatKeyframes = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
`;

const Spinner = ({ size }) => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 mt-2 text-red-500 dark:text-red-400 text-sm">
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
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

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Login successful! Redirecting to your dashboard...
          </p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>

          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
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

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, you would use a proper router
    // For demo purposes, we'll just log the navigation
    if (path === "/dashboard") {
      console.log("Would navigate to dashboard");
    } else if (path === "/register") {
      console.log("Would navigate to register");
    } else if (path === "/forgot-password") {
      console.log("Would navigate to forgot password");
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        } else if (value.length > 254) {
          error = "Email address is too long";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long";
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowSuccess(true);
      setForm({ email: "", password: "" });
      setErrors({});
      setTouched({});

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setErrors({ submit: "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "relative w-full px-6 py-4 border rounded-2xl bg-white/98 dark:bg-gray-800/98 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-base shadow-sm hover:shadow-lg font-medium";
    const hasError = errors[fieldName] && touched[fieldName];

    if (hasError) {
      return `${baseClass} border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-400/40 focus:border-red-400/60`;
    }

    return `${baseClass} border-gray-200/80 dark:border-gray-600/80 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400/60`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatKeyframes }} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 md:p-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/6 w-56 h-56 bg-indigo-300/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-purple-300/6 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative w-full max-w-7xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/12 via-indigo-400/10 to-purple-400/8 rounded-3xl blur-xl animate-pulse"></div>

          <div className="relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-white/60 dark:border-gray-700/60 rounded-3xl shadow-xl hover:shadow-blue-500/15 transition-all duration-500 overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left side - Welcome back section */}
              <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-12 flex flex-col justify-center items-center text-white overflow-hidden">
                <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/8 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>

                <div className="relative text-center z-10 max-w-md">
                  <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl mb-6 md:mb-8 shadow-lg backdrop-blur-sm animate-float">
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12 text-white"
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
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Welcome
                    <br />
                    <span className="text-white/90">Back!</span>
                  </h1>

                  <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed">
                    Sign in to access your dashboard and continue your journey
                    with us.
                  </p>

                  <div className="flex justify-center space-x-2 mb-6 md:mb-8">
                    <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-white/40 rounded-full animate-pulse delay-200"></div>
                    <div className="w-4 h-4 bg-white/60 rounded-full animate-pulse delay-500"></div>
                  </div>

                  <div className="text-sm text-white/70 space-y-1">
                    <p>🚀 Fast & Secure Login</p>
                    <p>🎯 Access Your Dashboard</p>
                    <p>✨ Premium Experience</p>
                  </div>
                </div>
              </div>

              {/* Right side - Login form */}
              <div className="p-12 flex flex-col justify-center">
                <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-400/15 to-indigo-400/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-8 right-12 w-12 h-12 bg-gradient-to-br from-purple-400/10 to-blue-400/15 rounded-full blur-lg animate-pulse delay-1000"></div>

                <div className="relative space-y-6 md:space-y-8 max-w-md mx-auto w-full">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      Sign In
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
                      Enter your credentials to continue
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <ErrorMessage message={errors.submit} />
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email field */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/8 to-indigo-400/6 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className={getInputClassName("email")}
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={() => handleInputBlur("email")}
                        disabled={loading}
                        autoComplete="email"
                      />
                      <ErrorMessage
                        message={touched.email ? errors.email : ""}
                      />
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/8 to-purple-400/6 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="password"
                        placeholder="Password"
                        className={getInputClassName("password")}
                        value={form.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        onBlur={() => handleInputBlur("password")}
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <ErrorMessage
                        message={touched.password ? errors.password : ""}
                      />
                    </div>

                    {/* Forgot password link */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-600 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 hover:underline text-sm"
                        disabled={loading}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-4 px-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex items-center justify-center space-x-2">
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
                  </form>

                  {/* Create account link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600 dark:text-gray-300 text-base">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-blue-600 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors duration-200 hover:underline"
                        disabled={loading}
                      >
                        Create Account
                      </button>
                    </p>
                  </div>

                  {/* Social login options */}
                  <div className="pt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        <span className="ml-2">Google</span>
                      </button>

                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        disabled={loading}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="ml-2">Facebook</span>
                      </button>
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
