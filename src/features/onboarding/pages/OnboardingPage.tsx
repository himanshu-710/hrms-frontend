import { useAuth } from "@/features/auth/context/AuthContext";
import ProfilePrimaryForm from "@/features/onboarding/components/ProfilePrimaryForm";
import ContactForm from "@/features/onboarding/components/ContactForm";

export default function OnboardingPage() {
  const { employee } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Welcome, {employee?.work_email ?? "Employee"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Start with your primary and contact details, then use the onboarding steps on the left
          to complete the remaining sections.
        </p>
      </div>

      <ProfilePrimaryForm />
      <ContactForm />
    </div>
  );
}
