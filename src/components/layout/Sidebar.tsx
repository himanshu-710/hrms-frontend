import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  role?: string | null;
}

interface NavItem {
  label: string;
  to: string;
  roles?: string[];
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Attendance",
    items: [{ label: "Attendance Dashboard", to: "/app/attendance" }],
  },
  {
    title: "Leave",
    items: [{ label: "Leave Dashboard", to: "/app/leave" }],
  },
  {
    title: "Onboarding",
    items: [
      { label: "Onboarding Home", to: "/app/onboarding" },
      { label: "Documents", to: "/app/onboarding/documents" },
      { label: "Completion", to: "/app/onboarding/completion" },
      { label: "Admin Dashboard", to: "/app/onboarding/admin", roles: ["HR"] },
    ],
  },
  {
    title: "Expenses",
    items: [{ label: "Expenses Dashboard", to: "/app/expenses" }],
  },
  {
    title: "Assets",
    items: [{ label: "Assets Dashboard", to: "/app/assets" }],
  },
];

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
  role,
}: SidebarProps) {
  const content = (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-slate-200 bg-white",
        collapsed ? "items-center" : "items-stretch"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-slate-200 px-4",
          collapsed ? "justify-center px-2" : "justify-start"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            H
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-900">HRMS</p>
              <p className="text-xs text-slate-500">Employee Portal</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-6">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (!item.roles) return true;
              return item.roles.includes(role ?? "");
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                {!collapsed && (
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {group.title}
                  </p>
                )}

                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-xl px-3 py-2 text-sm transition",
                          collapsed ? "justify-center" : "justify-start",
                          isActive
                            ? "bg-blue-50 font-medium text-blue-700"
                            : "text-slate-700 hover:bg-slate-100"
                        )
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {collapsed ? item.label.charAt(0) : item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden h-full md:block">{content}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 h-full w-240px bg-white shadow-lg">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
