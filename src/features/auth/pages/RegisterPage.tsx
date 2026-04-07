import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, toast } from "@/components/ui";
import { useAuth } from "@/features/auth/context/useAuth";

const registerSchema = z.object({
  work_email: z
    .string()
    .min(1, "Work email is required")
    .email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  employee_code: z.string().min(1, "Employee code is required"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      work_email: "",
      password: "",
      employee_code: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values);
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Register</h1>
        <p className="mb-6 text-sm text-slate-600">
          Create your HRMS account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Work Email"
            type="email"
            placeholder="Enter work email"
            error={errors.work_email?.message}
            {...register("work_email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Employee Code"
            type="text"
            placeholder="Enter employee code"
            error={errors.employee_code?.message}
            {...register("employee_code")}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Register
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
