import { useAuth } from "@/features/auth/context/useAuth";

export default function OnboardingDocumentVerificationPage() {
  const { role } = useAuth();

  if (role !== "HR") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">You do not have access to document verification.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-900">Document Verification</h2>
      <p className="mt-2 text-sm text-slate-600">
        Verification actions are supported by the backend, but the frontend still needs the admin
        list endpoint for pending documents across employees before this screen can be completed.
      </p>
    </div>
  );
}
