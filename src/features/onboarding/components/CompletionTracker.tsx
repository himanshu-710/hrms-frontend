import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

const SECTIONS = [
  "profile",
  "contact",
  "education",
  "experience",
  "addresses",
  "relations",
  "identity",
  "documents",
  "assets",
];

export default function CompletionTracker() {
  const { employee } = useAuth();
  const employeeId = employee?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-completion", employeeId],
    queryFn: () => onboardingApi.getCompletion(employeeId as number),
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Spinner />
          <span className="text-sm text-slate-600">
            Loading completion...
          </span>
        </div>
      </div>
    );
  }

  const sections = data?.sections ?? {};
  const percentage = data?.percentage ?? 0;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Completion Tracker
        </h3>
        <p className="text-sm text-slate-600">
          Overall onboarding progress
        </p>
      </div>

      <div className="text-3xl font-bold text-blue-600">
        {percentage}%
      </div>

      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const completed = sections?.[section] === true;

          return (
            <div
              key={section}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                completed
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className="capitalize">{section}</span>
              <span>{completed ? "OK" : "-"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}