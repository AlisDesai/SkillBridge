import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="relative bg-gradient-to-r from-gray-950/95 via-slate-950/95 to-gray-900/95 backdrop-blur-xl border-b border-slate-600/20 px-6 py-4 shadow-xl">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/3 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-500/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex justify-center items-center max-w-7xl mx-auto">
        {/* Simple header content - no search */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
            SkillBridge
          </h2>
        </div>
      </div>
    </header>
  );
}