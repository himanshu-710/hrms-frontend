import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination, Spinner } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

const PAGE_SIZE = 8;

type AdminDashboardRow = {
  employee_id: number;
  name: string;
  department: string;
  date_of_joining: string;
  days_since_joining: number;
  completion_pct: number;
  incomplete_sections: string[];
};

export default function OnboardingAdminDashboardPage() {
  const { role } = useAuth();
  const [page, setPage] = useState(1);
  const [completionBelow, setCompletionBelow] = useState(100);

  const { data = [], isLoading, isError } = useQuery<AdminDashboardRow[]>({
    queryKey: ["onboarding-admin-dashboard", role],
    queryFn: () => onboardingApi.getAdminDashboard(),
    enabled: role === "HR",
  });

  const filteredRows = useMemo(
    () => data.filter((row) => row.completion_pct <= completionBelow),
    [completionBelow, data]
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (role !== "HR") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">
          You do not have access to the onboarding admin dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Spinner />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">
          Unable to load onboarding admin dashboard right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Onboarding Admin Dashboard
          </h2>
          <p className="text-sm text-slate-600">
            Track employee onboarding progress and send reminders.
          </p>
        </div>

        <label className="block text-sm text-slate-700">
          Completion below:{" "}
          <span className="font-medium">{completionBelow}%</span>
          <input
            className="mt-2 block w-64"
            type="range"
            min="0"
            max="100"
            value={completionBelow}
            onChange={(event) => {
              setCompletionBelow(Number(event.target.value));
              setPage(1);
            }}
          />
        </label>
      </div>

      {pagedRows.length === 0 ? (
        <p className="text-sm text-slate-500">
          No employees match the current completion filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Date of Joining</th>
                <th className="px-3 py-2">Days Since Joining</th>
                <th className="px-3 py-2">Completion</th>
                <th className="px-3 py-2">Incomplete Sections</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr
                  key={row.employee_id}
                  className="border-b border-slate-100 align-top"
                >
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {row.name}
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {row.department || "—"}
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {row.date_of_joining || "—"}
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {row.days_since_joining}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex min-w-32 items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${row.completion_pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700">
                        {row.completion_pct}%
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {row.incomplete_sections.length > 0 ? (
                        row.incomplete_sections.map((section: string) => (
                          <span
                            key={`${row.employee_id}-${section}`}
                            className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700"
                          >
                            {section}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-green-700">
                          All complete
                        </span>
                      )}
                    </div>
                  </td>

                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={safePage} total={totalPages} onChange={setPage} />
    </div>
  );
}