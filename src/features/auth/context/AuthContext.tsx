import {
  useState,
  type ReactNode,
} from "react";
import api from "@/lib/api";
import { AuthContext, type AuthContextType } from "@/features/auth/context/auth-state";
import {
  clearAuthSession,
  createLoginSession,
  getAccessToken,
  getStoredEmployee,
  getStoredRole,
  persistAuthSession,
  redirectToLogin,
  refreshStoredSession,
} from "@/features/auth/lib/authStorage";
import type {
  Employee,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(() => getStoredEmployee());
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken());
  const [role, setRole] = useState<string | null>(() => getStoredRole());

  const login = async (payload: LoginPayload) => {
    const { data } = await api.post("/auth/login", payload);
    const session = createLoginSession(data, payload.work_email);

    if (!session) {
      throw new Error("Invalid access token");
    }

    persistAuthSession(session);
    setAccessToken(session.accessToken);
    setRole(session.role);
    setEmployee(session.employee);
  };

  const register = async (payload: RegisterPayload) => {
    await api.post("/auth/register", payload);
  };

  const logout = () => {
    clearAuthSession();
    setAccessToken(null);
    setRole(null);
    setEmployee(null);
    redirectToLogin();
  };

  const refreshToken = async () => {
    try {
      const session = await refreshStoredSession();

      if (!session) {
        logout();
        return null;
      }

      setAccessToken(session.accessToken);
      setRole(session.role);
      setEmployee(session.employee);

      return session.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const value: AuthContextType = {
    employee,
    accessToken,
    role,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
