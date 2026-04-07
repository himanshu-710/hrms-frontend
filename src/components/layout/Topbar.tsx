import { useState } from "react";
import { Button } from "@/components/ui";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { useAuth } from "@/features/auth/context/useAuth";

interface TopbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Topbar({
  onMenuClick,
  showMenuButton = false,
}: TopbarProps) {
  const { employee, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials =
    `${employee?.first_name?.[0] ?? ""}${employee?.last_name?.[0] ?? ""}` ||
    "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm md:hidden"
          >
            ☰
          </button>
        )}

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
          🔔
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-slate-900">
                {employee?.first_name ?? "User"}
              </p>
              <p className="text-xs text-slate-500">
                {employee?.work_email ?? "No email"}
              </p>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">
                Profile
              </button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
