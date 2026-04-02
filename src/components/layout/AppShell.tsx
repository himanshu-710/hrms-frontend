import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/features/auth/context/AuthContext";

export default function AppShell() {
  const { role } = useAuth();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isMd = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarCollapsed = isMd;

  return (
    <div className="h-screen bg-slate-50">
      <div className="flex h-full">
        {!isMobile && (
          <div className={sidebarCollapsed ? "w-20" : "w-[240px]"}>
            <Sidebar collapsed={sidebarCollapsed} role={role} />
          </div>
        )}

        {isMobile && (
          <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} role={role} />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar showMenuButton={isMobile} onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
