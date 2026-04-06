import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";

type IdentityFormValues = {
  doc_type: "AADHAAR" | "PAN" | "PASSPORT" | "";
  doc_number: string;
};

function maskAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "XXXX-XXXX-XXXX";
  return `XXXX-XXXX-${digits.slice(-4)}`;
}

function maskPan(value: string) {
  if (!value || value.length < 4) return "****";
  return `****${value.slice(-4)}`;
}

export default function IdentityForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: identityList } = useQuery({
    queryKey: ["onboarding-identity", employeeId],
    queryFn: () => onboardingApi.getIdentity(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, control, handleSubmit, reset } = useForm<IdentityFormValues>({
    defaultValues: {
      doc_type: "",
      doc_number: "",
    },
  });

  useEffect(() => {
    const identity = identityList?.[0];
    if (!identity) return;

    reset({
      doc_type: identity.doc_type ?? "",
      doc_number: identity.doc_number ?? "",
    });
  }, [identityList, reset]);

  const docType = useWatch({ control, name: "doc_type" });
  const docNumber = useWatch({ control, name: "doc_number" });

  const maskedPreview = useMemo(() => {
    if (docType === "AADHAAR") return maskAadhaar(docNumber || "");
    if (docType === "PAN") return maskPan(docNumber || "");
    return docNumber || "-";
  }, [docType, docNumber]);

  const mutation = useMutation({
    mutationFn: (values: IdentityFormValues) =>
      onboardingApi.saveIdentity(employeeId as number, {
        doc_type: values.doc_type as "AADHAAR" | "PAN" | "PASSPORT",
        doc_number: values.doc_number,
      }),
    onSuccess: () => {
      toast.success("Identity details updated");
      queryClient.invalidateQueries({ queryKey: ["onboarding-identity", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-profile", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update identity details");
    },
  });

  const onSubmit = (values: IdentityFormValues) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    mutation.mutate(values);
  };

  return (
    <div className="space-y-4">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Document Type"
          options={[
            { label: "Select document type", value: "" },
            { label: "AADHAAR", value: "AADHAAR" },
            { label: "PAN", value: "PAN" },
            { label: "PASSPORT", value: "PASSPORT" },
          ]}
          {...register("doc_type")}
        />

        <Input label="Document Number" {...register("doc_number")} />

        {(docType === "AADHAAR" || docType === "PAN") && (
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">Masked Preview</p>
            <p className="mt-1 text-sm text-slate-600">{maskedPreview}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <Button type="submit" isLoading={mutation.isPending}>
            Save Identity
          </Button>
        </div>
      </form>
    </div>
  );
}
