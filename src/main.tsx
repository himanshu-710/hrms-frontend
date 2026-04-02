import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { queryClient } from "@/lib/queryClient";
import router from "@/router";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ToastProvider } from "@/components/ui";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
