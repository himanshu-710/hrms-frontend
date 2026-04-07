import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Select, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

type PrimaryFormValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  display_name: string;
  dob: string;
  gender: string;
  marital_status: string;
  blood_group: string;
  nationality: string;
};

export default function ProfilePrimaryForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, handleSubmit, reset } =
    useForm<PrimaryFormValues>({
      defaultValues: {
        first_name: "",
        middle_name: "",
        last_name: "",
        display_name: "",
        dob: "",
        gender: "",
        marital_status: "",
        blood_group: "",
        nationality: "",
      },
    });

  useEffect(() => {
    if (!profile?.employee) return;

    reset({
      first_name: profile.employee.first_name ?? "",
      middle_name: profile.employee.middle_name ?? "",
      last_name: profile.employee.last_name ?? "",
      display_name: profile.employee.display_name ?? "",
      dob: profile.employee.dob ?? "",
      gender: profile.employee.gender ?? "",
      marital_status: profile.employee.marital_status ?? "",
      blood_group: profile.employee.blood_group ?? "",
      nationality: profile.employee.nationality ?? "",
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: PrimaryFormValues) =>
      onboardingApi.updatePrimary(employeeId as number, values),

    onSuccess: () => {
      toast.success("Primary details updated");

      queryClient.invalidateQueries({
        queryKey: ["onboarding-profile", employeeId],
      });

      queryClient.invalidateQueries({
        queryKey: ["onboarding-completion", employeeId],
      });
    },
  });

  const onSubmit = (values: PrimaryFormValues) => {
    if (!employeeId) return;
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          Primary Details
        </h3>
        <p className="text-sm text-slate-600">
          Basic employee information
        </p>
      </div>

      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input label="First Name" {...register("first_name")} />

        <Input label="Middle Name" {...register("middle_name")} />

        <Input label="Last Name" {...register("last_name")} />

        <Input label="Display Name" {...register("display_name")} />

        <Input
          label="Date of Birth"
          type="date"
          {...register("dob")}
        />

        <Select
          label="Gender"
          options={[
            { label: "Select gender", value: "" },
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Non Binary", value: "NON_BINARY" },
            { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
          ]}
          {...register("gender")}
        />

        <Select
          label="Marital Status"
          options={[
            { label: "Select", value: "" },
            { label: "Single", value: "SINGLE" },
            { label: "Married", value: "MARRIED" },
            { label: "Divorced", value: "DIVORCED" },
            { label: "Widowed", value: "WIDOWED" },
          ]}
          {...register("marital_status")}
        />

        <Select
          label="Blood Group"
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

        <Input label="Nationality" {...register("nationality")} />

        <div className="md:col-span-2">
          <Button type="submit">
            Save Primary Details
          </Button>
        </div>
      </form>
    </div>
  );
}