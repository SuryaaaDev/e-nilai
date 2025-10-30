import { Outlet } from "react-router-dom";
import Sidebar from "./SidebarTeacher";

export default function LayoutAdmin() {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen p-6 text-slate-100">
        <Outlet />
      </div>
    </div>
  );
}

