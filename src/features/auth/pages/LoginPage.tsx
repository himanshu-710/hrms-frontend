import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, toast } from "@/components/ui";
import { useAuth } from "@/features/auth/context/AuthContext";

const loginSchema = z.object({
  work_email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      work_email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      toast.success("Login successful");
      navigate("/app");
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mb-6 text-sm text-slate-600">
          Sign in to access HRMS dashboard
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Work Email"
            type="email"
            placeholder="Enter your work email"
            error={errors.work_email?.message}
            {...register("work_email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Login
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}