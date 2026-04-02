import { NavLink, Outlet } from "react-router-dom";
import { onboardingSteps } from "@/features/onboarding/constants/onboardingSteps";

const stepToPath: Record<string, string> = {
  "Primary Info": "/app/onboarding",
  Education: "/app/onboarding/education",
  Experience: "/app/onboarding/experience",
  Address: "/app/onboarding/address",
  Identity: "/app/onboarding/identity",
  Documents: "/app/onboarding/documents",
  Assets: "/app/onboarding/assets",
  Completion: "/app/onboarding/completion",
};

export default function OnboardingLayout() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Onboarding</h2>

        <nav className="space-y-2">
          {onboardingSteps.map((step, index) => (
            <NavLink
              key={step}
              to={stepToPath[step]}
              end={step === "Primary Info"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                {index + 1}
              </span>
              <span>{step}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <Outlet />
      </section>
    </div>
  );
}