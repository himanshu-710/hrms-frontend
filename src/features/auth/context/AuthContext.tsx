import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import api from "@/lib/api";
import { decodeJwt } from "@/lib/auth";
import type {
  AuthState,
  Employee,
  LoginPayload,
  LoginResponse,
  RefreshResponse,
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

function getStoredEmployee(): Employee | null {
  const stored = localStorage.getItem(EMPLOYEE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(() => getStoredEmployee());
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [role, setRole] = useState<string | null>(() =>
    localStorage.getItem(ROLE_KEY)
  );

  const login = async (payload: LoginPayload) => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);

    const { access_token, refresh_token } = data;
    const decoded = decodeJwt(access_token);

    if (!decoded) {
      throw new Error("Invalid access token");
    }

    const employeeData: Employee = {
      id: decoded.employee_id,
      work_email: payload.work_email,
    };

    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(ROLE_KEY, decoded.role);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employeeData));

    setAccessToken(access_token);
    setRole(decoded.role);
    setEmployee(employeeData);
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
      const { data } = await axios.post<RefreshResponse>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          refresh_token: storedRefreshToken,
        }
      );

      const decoded = decodeJwt(data.access_token);
      if (!decoded) {
        logout();
        return null;
      }

      const existingEmployee = getStoredEmployee();
      const employeeData: Employee = {
        id: decoded.employee_id,
        work_email: existingEmployee?.work_email,
      };

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      localStorage.setItem(ROLE_KEY, decoded.role);
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employeeData));

      setAccessToken(data.access_token);
      setRole(decoded.role);
      setEmployee(employeeData);

      return data.access_token;
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