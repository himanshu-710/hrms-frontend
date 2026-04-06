import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";

type DocumentListTableProps = {
  onReupload?: (docCategory: string) => void;
};

export default function DocumentListTable({ onReupload }: DocumentListTableProps) {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["onboarding-documents", employeeId],
    queryFn: () => onboardingApi.getDocuments(employeeId as number),
    enabled: !!employeeId,
  });

  const documents = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: (documentId: number) => onboardingApi.deleteDocument(documentId),
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["onboarding-documents", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to delete document");
    },
  });

  const handleDelete = (documentId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this document?");
    if (!confirmed) return;
    deleteMutation.mutate(documentId);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Loading documents...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-red-600">Unable to load documents right now.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Uploaded Documents</h3>
        <p className="text-sm text-slate-600">Review uploaded files and their status</p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-slate-500">No documents uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">File Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100">
                  <td className="px-3 py-3">{doc.file_name}</td>
                  <td className="px-3 py-3">{doc.doc_category}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                      {doc.verification_status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      {doc.presigned_url && (
                        <a
                          href={doc.presigned_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
                        >
                          View
                        </a>
                      )}

                      {doc.verification_status === "REJECTED" && onReupload && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => onReupload(doc.doc_category)}
                        >
                          Re-upload
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleDelete(doc.id)}
                        isLoading={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
