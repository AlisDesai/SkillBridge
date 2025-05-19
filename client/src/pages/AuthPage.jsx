import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4A6FFF] to-[#34D399] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "login" ? "Welcome Back" : "Join SkillBridge"}
          </h2>
          <button
            className="text-sm text-[#4A6FFF] hover:underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
        <div className="px-6 py-6">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
