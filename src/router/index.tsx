import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import AppHomePage from "@/features/app/pages/AppHomePage";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";
import OnboardingPage from "@/features/onboarding/pages/OnboardingPage";
import OnboardingAddressPage from "@/features/onboarding/pages/OnboardingAddressPage";
import OnboardingAssetsPage from "@/features/onboarding/pages/OnboardingAssetsPage";
import OnboardingCompletionPage from "@/features/onboarding/pages/OnboardingCompletionPage";
import OnboardingDocumentsPage from "@/features/onboarding/pages/OnboardingDocumentsPage";
import OnboardingEducationPage from "@/features/onboarding/pages/OnboardingEducationPage";
import OnboardingExperiencePage from "@/features/onboarding/pages/OnboardingExperiencePage";
import OnboardingIdentityPage from "@/features/onboarding/pages/OnboardingIdentityPage";

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
            element: <OnboardingLayout />,
            children: [
              {
                index: true,
                element: <OnboardingPage />,
              },
              {
                path: "education",
                element: <OnboardingEducationPage />,
              },
              {
                path: "experience",
                element: <OnboardingExperiencePage />,
              },
              {
                path: "address",
                element: <OnboardingAddressPage />,
              },
              {
                path: "identity",
                element: <OnboardingIdentityPage />,
              },
              {
                path: "documents",
                element: <OnboardingDocumentsPage />,
              },
              {
                path: "assets",
                element: <OnboardingAssetsPage />,
              },
              {
                path: "completion",
                element: <OnboardingCompletionPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
