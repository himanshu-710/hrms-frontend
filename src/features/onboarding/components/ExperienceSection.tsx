import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";
import ExperienceEntryForm from "@/features/onboarding/components/ExperienceEntryForm";
import type {
  ExperienceItem,
  ExperiencePayload,
} from "@/features/onboarding/types/onboarding.types";

export default function ExperienceSection() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  const { data: experienceList = [], isLoading } = useQuery({
    queryKey: ["onboarding-experience", employeeId],
    queryFn: () => onboardingApi.getExperience(employeeId as number),
    enabled: !!employeeId,
  });

  const addMutation = useMutation({
    mutationFn: (values: ExperiencePayload) => onboardingApi.addExperience(values),
    onSuccess: () => {
      toast.success("Experience added");
      setIsFormOpen(false);
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["onboarding-experience", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to add experience");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ExperiencePayload }) =>
      onboardingApi.updateExperience(id, values),
    onSuccess: () => {
      toast.success("Experience updated");
      setIsFormOpen(false);
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["onboarding-experience", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update experience");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => onboardingApi.deleteExperience(id),
    onSuccess: () => {
      toast.success("Experience deleted");
      queryClient.invalidateQueries({ queryKey: ["onboarding-experience", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to delete experience");
    },
  });

  const handleSubmit = (values: ExperiencePayload) => {
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

  const handleEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this experience entry?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
          <p className="text-sm text-slate-600">Add your previous work experience</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleAdd}>
          Add Experience
        </Button>
      </div>

      {isFormOpen && employeeId && (
        <div className="rounded-xl border border-slate-200 p-4">
          <ExperienceEntryForm
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
        <p className="text-sm text-slate-500">Loading experience...</p>
      ) : experienceList.length === 0 ? (
        <p className="text-sm text-slate-500">No experience added yet.</p>
      ) : (
        <div className="space-y-3">
          {experienceList.map((item: ExperienceItem) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{item.company_name}</p>
                <p className="text-sm text-slate-600">
                  {item.designation} | {item.employment_type}
                </p>
                <p className="text-sm text-slate-500">
                  {item.start_date} - {item.is_current ? "Present" : item.end_date || "N/A"}
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
