import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/AuthContext";

const primarySchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "DOB is required"),
  gender: z.string().min(1, "Gender is required"),
  blood_group: z.string().min(1, "Blood group is required"),
});

type PrimaryFormValues = z.infer<typeof primarySchema>;

export default function ProfilePrimaryForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  useEffect(() => {
    if (!profile?.employee) return;

    reset({
      first_name: profile.employee.first_name ?? "",
      last_name: profile.employee.last_name ?? "",
      dob: profile.employee.dob ?? "",
      gender: profile.employee.gender ?? "",
      blood_group: profile.employee.blood_group ?? "",
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: PrimaryFormValues) =>
      onboardingApi.updatePrimaryDetails(employeeId as number, values),
    onSuccess: () => {
      toast.success("Primary details updated");
      queryClient.invalidateQueries({ queryKey: ["onboarding-profile", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update primary details");
    },
  });

  const onSubmit = async (values: PrimaryFormValues) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    mutation.mutate(values);
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
          <Button type="submit" isLoading={mutation.isPending}>
            Save Primary Details
          </Button>
        </div>
      </form>
    </div>
  );
}