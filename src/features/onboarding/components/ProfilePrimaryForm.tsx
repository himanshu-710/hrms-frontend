import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/components/ui";

const primarySchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "DOB is required"),
  gender: z.string().min(1, "Gender is required"),
  blood_group: z.string().min(1, "Blood group is required"),
});

type PrimaryFormValues = z.infer<typeof primarySchema>;

export default function ProfilePrimaryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrimaryFormValues>({
    resolver: zodResolver(primarySchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
      blood_group: "",
    },
  });

  const onSubmit = async (values: PrimaryFormValues) => {
    console.log("Primary form values:", values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Primary Details</h3>
        <p className="text-sm text-slate-600">Basic employee information</p>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="First Name"
          error={errors.first_name?.message}
          {...register("first_name")}
        />

        <Input
          label="Last Name"
          error={errors.last_name?.message}
          {...register("last_name")}
        />

        <Input
          label="Date of Birth"
          type="date"
          error={errors.dob?.message}
          {...register("dob")}
        />

        <Select
          label="Gender"
          error={errors.gender?.message}
          options={[
            { label: "Select gender", value: "" },
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Other", value: "Other" },
          ]}
          {...register("gender")}
        />

        <Select
          label="Blood Group"
          error={errors.blood_group?.message}
          options={[
            { label: "Select blood group", value: "" },
            { label: "A+", value: "A+" },
            { label: "A-", value: "A-" },
            { label: "B+", value: "B+" },
            { label: "B-", value: "B-" },
            { label: "AB+", value: "AB+" },
            { label: "AB-", value: "AB-" },
            { label: "O+", value: "O+" },
            { label: "O-", value: "O-" },
          ]}
          {...register("blood_group")}
        />

        <div className="md:col-span-2">
          <Button type="submit" isLoading={isSubmitting}>
            Save Primary Details
          </Button>
        </div>
      </form>
    </div>
  );
}