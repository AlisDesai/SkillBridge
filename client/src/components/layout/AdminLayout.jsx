import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}