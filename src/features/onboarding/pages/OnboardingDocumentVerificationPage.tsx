import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spinner, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

type PendingDocument = {
  id: number;
  employee_name: string;
  doc_category: string;
  file_name: string;
  presigned_url?: string;
  verification_status: string;
};

export default function OnboardingDocumentVerificationPage() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PendingDocument[] | null>({
    queryKey: ["admin-documents"],
    queryFn: onboardingApi.getPendingDocuments,
    enabled: role === "HR",
  });

  const documents = data ?? [];

  const verifyMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "VERIFIED" | "REJECTED";
    }) => onboardingApi.verifyDocument(id, { status }),

    onSuccess: () => {
      toast.success("Document updated");
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
    },

    onError: () => {
      toast.error("Failed to update document");
    },
  });

  if (role !== "HR") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">
          You do not have access to document verification.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <Spinner />
          <span>Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Document Verification
        </h2>

        <p className="text-sm text-slate-600">
          Review and verify employee documents
        </p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-slate-500">
          No pending documents
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium">
                  {doc.employee_name}
                </p>

                <p className="text-sm text-slate-600">
                  {doc.doc_category}
                </p>

                <p className="text-xs text-slate-500">
                  {doc.file_name}
                </p>
              </div>

              <div className="flex gap-2">
                {doc.presigned_url && (
                  <a
                    href={doc.presigned_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    View
                  </a>
                )}

                <Button
                  variant="secondary"
                  onClick={() =>
                    verifyMutation.mutate({
                      id: doc.id,
                      status: "VERIFIED",
                    })
                  }
                >
                  Approve
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    verifyMutation.mutate({
                      id: doc.id,
                      status: "REJECTED",
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}