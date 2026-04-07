import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

type FormValues = {
  doc_type: "AADHAAR" | "PAN" | "PASSPORT" | "";
  doc_number: string;
  name_on_doc: string;
  issue_date: string;
  expiry_date: string;
};

function toRFC3339(date?: string) {
  if (!date) return null;
  return new Date(date + "T00:00:00Z").toISOString();
}

function fromRFC3339(date?: string) {
  if (!date) return "";
  return date.split("T")[0];
}

export default function IdentityForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      doc_type: "",
      doc_number: "",
      name_on_doc: "",
      issue_date: "",
      expiry_date: "",
    },
  });

  useEffect(() => {
    const identity = profile?.identity?.[0];
    if (!identity) return;

    reset({
      doc_type: identity.doc_type ?? "",
      doc_number: identity.doc_number ?? "",
      name_on_doc: identity.name_on_doc ?? "",
      issue_date: fromRFC3339(identity.issue_date),
      expiry_date: fromRFC3339(identity.expiry_date),
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      onboardingApi.updateIdentity(employeeId as number, {
        doc_type: values.doc_type,
        doc_number: values.doc_number,
        name_on_doc: values.name_on_doc,
        issue_date: toRFC3339(values.issue_date),
        expiry_date: toRFC3339(values.expiry_date),
      }),

    onSuccess: () => {
      toast.success("Identity saved");

      queryClient.invalidateQueries({
        queryKey: ["onboarding-profile", employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["onboarding-completion", employeeId],
      });
    },

    onError: () => {
      toast.error("Failed to save identity");
    },
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <Select
        label="Document Type"
        options={[
          { label: "Select", value: "" },
          { label: "AADHAAR", value: "AADHAAR" },
          { label: "PAN", value: "PAN" },
          { label: "PASSPORT", value: "PASSPORT" },
        ]}
        {...register("doc_type")}
      />

      <Input label="Document Number" {...register("doc_number")} />

      <Input label="Name on Document" {...register("name_on_doc")} />

      <Input type="date" label="Issue Date" {...register("issue_date")} />

      <Input type="date" label="Expiry Date" {...register("expiry_date")} />

      <div className="md:col-span-2">
        <Button type="submit" isLoading={mutation.isPending}>
          Save Identity
        </Button>
      </div>
    </form>
  );
}