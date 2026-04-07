import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui";
import DocumentListTable from "@/features/onboarding/components/DocumentListTable";
import DocumentUploadCard from "@/features/onboarding/components/DocumentUploadCard";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

export default function OnboardingDocumentsPage() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="space-y-6">
      <DocumentUploadCard
        selectedCategory={selectedCategory}
        onUpload={async (file, docCategory, onProgress) => {
          if (!employeeId) {
            toast.error("Employee id not found");
            return;
          }

          const formData = new FormData();
          formData.append("file", file);
          formData.append("doc_category", docCategory);

          await onboardingApi.uploadDocument(employeeId, formData, onProgress);
          toast.success("Document uploaded");
          setSelectedCategory("");
          queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
          queryClient.invalidateQueries({ queryKey: ["onboarding-documents", employeeId] });
        }}
      />

      <DocumentListTable
        onReupload={(docCategory) => {
          setSelectedCategory(docCategory);
          toast.error(`Please upload the ${docCategory} document again`);
        }}
      />
    </div>
  );
}
