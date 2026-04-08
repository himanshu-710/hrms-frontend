import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { onboardingSteps } from "@/features/onboarding/constants/onboardingSteps";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

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

type Sections = {
  profile?: boolean;
  contact?: boolean;
  education?: boolean;
  experience?: boolean;
  addresses?: boolean;
  relations?: boolean;
  identity?: boolean;
  documents?: boolean;
  assets?: boolean;
};

function getStepStatus(step: string, sections: Sections) {
  switch (step) {
    case "Primary Info":
      if (sections.profile && sections.contact) return "complete";
      if (sections.profile || sections.contact) return "in-progress";
      return "incomplete";

    case "Education":
      return sections.education ? "complete" : "incomplete";

    case "Experience":
      return sections.experience ? "complete" : "incomplete";

    case "Address":
      if (sections.addresses && sections.relations) return "complete";
      if (sections.addresses || sections.relations) return "in-progress";
      return "incomplete";

    case "Identity":
      return sections.identity ? "complete" : "incomplete";

    case "Documents":
      return sections.documents ? "complete" : "incomplete";

    case "Assets":
      return sections.assets ? "complete" : "incomplete";

    case "Completion":
      return Object.values(sections).every(Boolean)
        ? "complete"
        : "in-progress";

    default:
      return "incomplete";
  }
}

function StepStatusIcon({ status }: { status: string }) {
  if (status === "complete") {
    return <span className="text-green-600 text-sm">✓</span>;
  }

  if (status === "in-progress") {
    return <span className="text-amber-600 text-sm">•</span>;
  }

  return <span className="text-slate-400 text-sm">○</span>;
}

export default function OnboardingLayout() {
  const { employee } = useAuth();
  const employeeId = employee?.id;

  const { data } = useQuery({
    queryKey: ["onboarding-completion", employeeId],
    queryFn: () => onboardingApi.getCompletion(employeeId as number),
    enabled: !!employeeId,
  });

  const sections: Sections = data?.sections ?? {};

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Onboarding
        </h2>

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

              <span className="flex-1">{step}</span>

              <StepStatusIcon
                status={getStepStatus(step, sections)}
              />
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