import AddressForm from "@/features/onboarding/components/AddressForm";
import RelationsForm from "@/features/onboarding/components/RelationsForm";

export default function OnboardingAddressPage() {
  return (
    <div className="space-y-6">
      <AddressForm />

      <RelationsForm />
    </div>
  );
}