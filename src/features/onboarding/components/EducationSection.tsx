import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";
import EducationEntryForm from "@/features/onboarding/components/EducationEntryForm";
import type { EducationItem, EducationPayload } from "@/features/onboarding/types/onboarding.types";

export default function EducationSection() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["onboarding-education", employeeId],
    queryFn: () => onboardingApi.getEducation(employeeId as number),
    enabled: !!employeeId,
  });

  const educationList = Array.isArray(data) ? data : [];

  const addMutation = useMutation({
    mutationFn: (values: EducationPayload) => onboardingApi.addEducation(values),
    onSuccess: () => {
      toast.success("Education added");
      setIsFormOpen(false);
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["onboarding-education", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to add education");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: EducationPayload }) =>
      onboardingApi.updateEducation(id, values),
    onSuccess: () => {
      toast.success("Education updated");
      setIsFormOpen(false);
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["onboarding-education", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update education");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => onboardingApi.deleteEducation(id),
    onSuccess: () => {
      toast.success("Education deleted");
      queryClient.invalidateQueries({ queryKey: ["onboarding-education", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to delete education");
    },
  });

  const handleSubmit = (values: EducationPayload) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, values });
      return;
    }

    addMutation.mutate(values);
  };

  const handleEdit = (item: EducationItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this education entry?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Education</h3>
          <p className="text-sm text-slate-600">Add your academic details</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleAdd}>
          Add Education
        </Button>
      </div>

      {isFormOpen && employeeId && (
        <div className="rounded-xl border border-slate-200 p-4">
          <EducationEntryForm
            initialData={editingItem}
            employeeId={employeeId}
            isSaving={addMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading education...</p>
      ) : isError ? (
        <p className="text-sm text-red-600">Unable to load education right now.</p>
      ) : educationList.length === 0 ? (
        <p className="text-sm text-slate-500">No education added yet.</p>
      ) : (
        <div className="space-y-3">
          {educationList.map((item: EducationItem) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{item.degree}</p>
                <p className="text-sm text-slate-600">
                  {item.branch} | {item.university}
                </p>
                <p className="text-sm text-slate-500">
                  {item.year_of_joining} - {item.year_of_completion} | {item.cgpa_or_pct}
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleDelete(item.id)}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
