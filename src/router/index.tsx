import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import AppHomePage from "@/features/app/pages/AppHomePage";
import OnboardingLayout from "@/features/onboarding/components/OnboardingLayout";
import OnboardingPage from "@/features/onboarding/pages/OnboardingPage";
import OnboardingAddressPage from "@/features/onboarding/pages/OnboardingAddressPage";
import OnboardingAdminDashboardPage from "@/features/onboarding/pages/OnboardingAdminDashboardPage";
import OnboardingAssetsPage from "@/features/onboarding/pages/OnboardingAssetsPage";
import OnboardingCompletionPage from "@/features/onboarding/pages/OnboardingCompletionPage";
import OnboardingDocumentVerificationPage from "@/features/onboarding/pages/OnboardingDocumentVerificationPage";
import OnboardingDocumentsPage from "@/features/onboarding/pages/OnboardingDocumentsPage";
import OnboardingEducationPage from "@/features/onboarding/pages/OnboardingEducationPage";
import OnboardingExperiencePage from "@/features/onboarding/pages/OnboardingExperiencePage";
import OnboardingIdentityPage from "@/features/onboarding/pages/OnboardingIdentityPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" replace />,
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
                path: "admin/documents",
                element: <OnboardingDocumentVerificationPage />,
              },
              {
                path: "admin",
                element: <OnboardingAdminDashboardPage />,
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
