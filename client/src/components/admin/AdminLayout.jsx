import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="min-w-0 md:ml-64">
        {/* TOPBAR */}

        <Topbar onMenuClick={openSidebar} title="PLC Admin" />

        {/* PAGE CONTENT */}

        <main className="min-w-0 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
