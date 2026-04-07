import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

type FormValues = {
  personal_email: string;
  mobile_no: string;
  work_no: string;
  residence_no: string;
};

export default function ContactForm() {
  const { employee } = useAuth();
  const employeeId = employee?.id;
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["onboarding-profile", employeeId],
    queryFn: () => onboardingApi.getProfile(employeeId as number),
    enabled: !!employeeId,
  });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (!profile?.employee) return;

    reset({
      personal_email: profile.employee.personal_email ?? "",
      mobile_no: profile.employee.mobile_no ?? "",
      work_no: profile.employee.work_no ?? "",
      residence_no: profile.employee.residence_no ?? "",
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      onboardingApi.updateContact(employeeId as number, values),

    onSuccess: () => {
      toast.success("Contact updated");
      queryClient.invalidateQueries({
        queryKey: ["onboarding-profile", employeeId],
      });
    },
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <Input label="Personal Email" {...register("personal_email")} />
      <Input label="Mobile Number" {...register("mobile_no")} />
      <Input label="Work Number" {...register("work_no")} />
      <Input label="Residence Number" {...register("residence_no")} />

      <div className="md:col-span-2">
        <Button type="submit">Save Contact</Button>
      </div>
    </form>
  );
}