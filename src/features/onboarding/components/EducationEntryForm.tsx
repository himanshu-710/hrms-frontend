import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import type { EducationItem, EducationPayload } from "@/features/onboarding/types/onboarding.types";

type EducationEntryFormProps = {
  initialData?: EducationItem | null;
  employeeId: number;
  isSaving: boolean;
  onSubmit: (values: EducationPayload) => void;
  onCancel: () => void;
};

export default function EducationEntryForm({
  initialData,
  employeeId,
  isSaving,
  onSubmit,
  onCancel,
}: EducationEntryFormProps) {
  const { register, handleSubmit, reset } = useForm<EducationPayload>({
    defaultValues: {
      employee_id: employeeId,
      degree: "",
      branch: "",
      university: "",
      cgpa_or_pct: 0,
      year_of_joining: new Date().getFullYear(),
      year_of_completion: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    reset({
      employee_id: employeeId,
      degree: initialData?.degree ?? "",
      branch: initialData?.branch ?? "",
      university: initialData?.university ?? "",
      cgpa_or_pct: initialData?.cgpa_or_pct ?? 0,
      year_of_joining: initialData?.year_of_joining ?? new Date().getFullYear(),
      year_of_completion: initialData?.year_of_completion ?? new Date().getFullYear(),
    });
  }, [employeeId, initialData, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Degree" {...register("degree")} />
      <Input label="Branch" {...register("branch")} />
      <Input label="University" {...register("university")} />
      <Input
        label="CGPA / Percentage"
        type="number"
        step="0.01"
        {...register("cgpa_or_pct", { valueAsNumber: true })}
      />
      <Input
        label="Year of Joining"
        type="number"
        {...register("year_of_joining", { valueAsNumber: true })}
      />
      <Input
        label="Year of Completion"
        type="number"
        {...register("year_of_completion", { valueAsNumber: true })}
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSaving}>
          {initialData ? "Update Education" : "Add Education"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
