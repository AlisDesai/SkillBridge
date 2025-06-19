import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950">
      <Header />
      <main className="bg-transparent">
        <Outlet />
      </main>
    </div>
  );
}