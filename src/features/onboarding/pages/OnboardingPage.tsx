import ProfilePrimaryForm from "@/features/onboarding/components/ProfilePrimaryForm";
import ContactForm from "@/features/onboarding/components/ContactForm";
import IdentityForm from "@/features/onboarding/components/IdentityForm";
import AddressForm from "@/features/onboarding/components/AddressForm";
import CompletionTracker from "@/features/onboarding/components/CompletionTracker";
import DocumentUploadCard from "@/features/onboarding/components/DocumentUploadCard";

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <ProfilePrimaryForm />
      <ContactForm />
      <IdentityForm />
      <AddressForm />
      <CompletionTracker
        sections={{
          primary: true,
          education: false,
          experience: false,
          address: true,
          identity: false,
          documents: false,
          assets: false,
          completion: false,
        }}
        percentage={25}
      />
      <DocumentUploadCard
        onUpload={async (file, docCategory) => {
          console.log(file, docCategory);
        }}
      />
    </div>
  );
}