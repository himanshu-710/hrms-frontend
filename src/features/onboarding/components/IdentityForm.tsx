import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Input, Select } from "@/components/ui";

type IdentityFormValues = {
  doc_type: "AADHAAR" | "PAN" | "PASSPORT" | "";
  doc_number: string;
};

function maskAadhaar(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "XXXX-XXXX-XXXX";
  return `XXXX-XXXX-${digits.slice(-4)}`;
}

export default function IdentityForm() {
  const { register, control, handleSubmit, formState: { isSubmitting } } =
    useForm<IdentityFormValues>({
      defaultValues: {
        doc_type: "",
        doc_number: "",
      },
    });

  const docType = useWatch({ control, name: "doc_type" });
  const docNumber = useWatch({ control, name: "doc_number" });

  const maskedPreview = useMemo(() => {
    if (docType === "AADHAAR") return maskAadhaar(docNumber || "");
    return docNumber || "-";
  }, [docType, docNumber]);

  const onSubmit = async (values: IdentityFormValues) => {
    console.log("Identity form values:", values);
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

        <Input
          label="Document Number"
          {...register("doc_number")}
        />

        {docType === "AADHAAR" && (
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">Masked Preview</p>
            <p className="mt-1 text-sm text-slate-600">{maskedPreview}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <Button type="submit" isLoading={isSubmitting}>
            Save Identity
          </Button>
        </div>
      </form>
    </div>
  );
}