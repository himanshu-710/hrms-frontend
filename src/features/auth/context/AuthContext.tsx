import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import api from "@/lib/api";
import type {
  AuthState,
  Employee,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "role";
const EMPLOYEE_KEY = "employee";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(() => {
    const stored = localStorage.getItem("employee");
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRole = localStorage.getItem(ROLE_KEY);
    const storedEmployee = localStorage.getItem(EMPLOYEE_KEY);

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedRole) setRole(storedRole);
    if (storedEmployee) setEmployee(JSON.parse(storedEmployee));
  }, []);

  const login = async (payload: LoginPayload) => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);

    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(ROLE_KEY, data.role);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data.employee));

    setAccessToken(data.accessToken);
    setRole(data.role);
    setEmployee(data.employee);
  };

  const register = async (payload: RegisterPayload) => {
    await api.post("/auth/register", payload);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMPLOYEE_KEY);

    setAccessToken(null);
    setRole(null);
    setEmployee(null);

    window.location.href = "/login";
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!storedRefreshToken) {
      logout();
      return null;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        refreshToken: storedRefreshToken,
      });

      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      setAccessToken(data.accessToken);

      return data.accessToken;
    } catch {
      logout();
      return null;
    }
  };

  const value = useMemo(
    () => ({
      employee,
      accessToken,
      role,
      login,
      register,
      logout,
      refreshToken,
      isAuthenticated: !!accessToken,
    }),
    [employee, accessToken, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}