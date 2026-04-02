import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import AppHomePage from "@/features/app/pages/AppHomePage";
import OnboardingPage from "@/features/onboarding/pages/OnboardingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <AppHomePage />,
          },
          {
            path: "onboarding",
            element: <OnboardingPage />,
          },
        ],
      },
    ],
  },
]);

export default router;