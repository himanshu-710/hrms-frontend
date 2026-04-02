import { Spinner } from "@/components/ui";

type CompletionTrackerProps = {
  sections: Record<string, boolean>;
  percentage: number;
  loading?: boolean;
};

const defaultSections = [
  "primary",
  "education",
  "experience",
  "address",
  "identity",
  "documents",
  "assets",
  "completion",
];

export default function CompletionTracker({
  sections,
  percentage,
  loading = false,
}: CompletionTrackerProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Spinner />
          <span className="text-sm text-slate-600">Loading completion...</span>
        </div>

        <div className="mt-4 space-y-3">
          {defaultSections.map((item) => (
            <div key={item} className="h-10 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const incompleteSections = Object.entries(sections)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Completion Tracker</h3>
        <p className="text-sm text-slate-600">Overall onboarding progress</p>
      </div>

      <div className="text-3xl font-bold text-blue-600">{percentage}%</div>

      <div className="space-y-2">
        {defaultSections.map((section) => {
          const completed = !!sections[section];

          return (
            <div
              key={section}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                completed ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className="capitalize">{section}</span>
              <span>{completed ? "✔" : "—"}</span>
            </div>
          );
        })}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Incomplete sections</p>
        <div className="flex flex-wrap gap-2">
          {incompleteSections.length > 0 ? (
            incompleteSections.map((section) => (
              <span
                key={section}
                className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600"
              >
                {section}
              </span>
            ))
          ) : (
            <span className="text-sm text-green-600">All sections completed</span>
          )}
        </div>
      </div>
    </div>
  );
}