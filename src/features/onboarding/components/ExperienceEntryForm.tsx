import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import type {
  ExperienceItem,
  ExperiencePayload,
} from "@/features/onboarding/types/onboarding.types";

type ExperienceEntryFormProps = {
  initialData?: ExperienceItem | null;
  employeeId: number;
  isSaving: boolean;
  onSubmit: (values: ExperiencePayload) => void;
  onCancel: () => void;
};

export default function ExperienceEntryForm({
  initialData,
  employeeId,
  isSaving,
  onSubmit,
  onCancel,
}: ExperienceEntryFormProps) {
  const { register, handleSubmit, control, reset } = useForm<ExperiencePayload>({
    defaultValues: {
      employee_id: employeeId,
      company_name: "",
      designation: "",
      employment_type: "",
      start_date: "",
      end_date: "",
      is_current: false,
      industry: "",
      description: "",
    },
  });

  const isCurrent = useWatch({ control, name: "is_current" });

  useEffect(() => {
    reset({
      employee_id: employeeId,
      company_name: initialData?.company_name ?? "",
      designation: initialData?.designation ?? "",
      employment_type: initialData?.employment_type ?? "",
      start_date: initialData?.start_date ?? "",
      end_date: initialData?.end_date ?? "",
      is_current: initialData?.is_current ?? false,
      industry: initialData?.industry ?? "",
      description: initialData?.description ?? "",
    });
  }, [employeeId, initialData, reset]);

  const handleFormSubmit = (values: ExperiencePayload) => {
    onSubmit({
      ...values,
      end_date: values.is_current ? null : values.end_date || null,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input label="Company Name" {...register("company_name")} />
      <Input label="Designation" {...register("designation")} />
      <Input label="Employment Type" {...register("employment_type")} />
      <Input label="Start Date" type="date" {...register("start_date")} />
      <Input
        label="End Date"
        type="date"
        disabled={isCurrent}
        {...register("end_date")}
      />
      <Input label="Industry" {...register("industry")} />
      <Input label="Description" {...register("description")} />

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register("is_current")} />
        Currently Working Here
      </label>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSaving}>
          {initialData ? "Update Experience" : "Add Experience"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
