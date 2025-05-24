import { NavLink } from "react-router-dom";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/profile", label: "Profile" },
  { path: "/skills", label: "Skills" },
  { path: "/matches", label: "Matches" },
  { path: "/chat", label: "Chat" },
  { path: "/reviews", label: "Reviews" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col p-4">
      <div className="text-2xl font-bold text-[#4A6FFF] mb-6">SkillBridge</div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-[#4A6FFF] text-white"
                  : "text-gray-700 hover:bg-[#E5E7EB]"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
