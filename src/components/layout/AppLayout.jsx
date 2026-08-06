"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-grid min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">{children}</main>
      </div>
    </div>
  );
}
