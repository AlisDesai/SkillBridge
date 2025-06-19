import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 relative">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <main className="flex-1 overflow-y-auto bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Footer positioned outside flex container to span full width */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}
