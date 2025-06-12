import { NavLink } from "react-router-dom";

const adminLinks = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/users", label: "User Management" },
  { path: "/admin/reviews", label: "Review Management" },
  { path: "/admin/skills", label: "Skill Management" },
  { path: "/admin/stats", label: "Statistics" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col p-4">
      <div className="text-2xl font-bold text-[#4A6FFF] mb-6">
        SkillBridge Admin
      </div>
      <nav className="flex flex-col gap-2">
        {adminLinks.map((link) => (
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
