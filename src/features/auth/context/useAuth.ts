import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/auth-state";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
