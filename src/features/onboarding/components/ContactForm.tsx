import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, toast } from "@/components/ui";
import { onboardingApi } from "@/features/onboarding/api/onboardingApi";
import { useAuth } from "@/features/auth/context/useAuth";

const contactSchema = z.object({
  personal_email: z.string().min(1, "Email is required").email("Invalid email"),
  mobile_no: z.string().min(10, "Mobile number is required"),
  work_no: z.string().min(1, "Work number is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
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
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      personal_email: "",
      mobile_no: "",
      work_no: "",
    },
  });

  useEffect(() => {
    if (!profile?.employee) return;

    reset({
      personal_email: profile.employee.personal_email ?? "",
      mobile_no: profile.employee.mobile_no ?? "",
      work_no: profile.employee.work_no ?? "",
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) =>
      onboardingApi.updateContact(employeeId as number, values),
    onSuccess: () => {
      toast.success("Contact details updated");
      queryClient.invalidateQueries({ queryKey: ["onboarding-profile", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-completion", employeeId] });
    },
    onError: () => {
      toast.error("Failed to update contact details");
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (!employeeId) {
      toast.error("Employee id not found");
      return;
    }

    mutation.mutate(values);
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Personal Email"
        type="email"
        error={errors.personal_email?.message}
        {...register("personal_email")}
      />

      <Input
        label="Mobile Number"
        error={errors.mobile_no?.message}
        {...register("mobile_no")}
      />

      <Input
        label="Work Number"
        error={errors.work_no?.message}
        {...register("work_no")}
      />

      <div className="md:col-span-2">
        <Button type="submit" isLoading={mutation.isPending}>
          Save Contact Details
        </Button>
      </div>
    </form>
  );
}
