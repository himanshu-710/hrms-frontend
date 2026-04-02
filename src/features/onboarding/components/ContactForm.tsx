import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";

const contactSchema = z.object({
  personal_email: z.string().min(1, "Email is required").email("Invalid email"),
  mobile_no: z.string().min(10, "Mobile number is required"),
  work_no: z.string().min(1, "Work number is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      personal_email: "",
      mobile_no: "",
      work_no: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    console.log("Contact form values:", values);
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
        <Button type="submit" isLoading={isSubmitting}>
          Save Contact Details
        </Button>
      </div>
    </form>
  );
}