import axios from "axios";
import { decodeJwt } from "@/lib/auth";
import type {
  Employee,
  LoginResponse,
  RefreshResponse,
} from "@/features/auth/types/auth.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ROLE_KEY = "role";
const EMPLOYEE_KEY = "employee";

export type StoredAuthSession = {
  accessToken: string;
  refreshToken: string;
  role: string;
  employee: Employee;
};

export function getStoredEmployee(): Employee | null {
  const storedEmployee = localStorage.getItem(EMPLOYEE_KEY);
  return storedEmployee ? (JSON.parse(storedEmployee) as Employee) : null;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function persistAuthSession(session: StoredAuthSession) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(ROLE_KEY, session.role);
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(session.employee));
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);
}

export function redirectToLogin() {
  window.location.href = "/login";
}

function buildSession(
  tokens: LoginResponse | RefreshResponse,
  employee: Employee
): StoredAuthSession | null {
  const decoded = decodeJwt(tokens.access_token);

  if (!decoded) {
    return null;
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    role: decoded.role,
    employee: {
      ...employee,
      id: decoded.employee_id,
    },
  };
}

export function createLoginSession(
  tokens: LoginResponse,
  workEmail: string
): StoredAuthSession | null {
  return buildSession(tokens, { work_email: workEmail });
}

export async function refreshStoredSession(): Promise<StoredAuthSession | null> {
  const storedRefreshToken = getRefreshToken();

  if (!storedRefreshToken) {
    return null;
  }

  const { data } = await axios.post<RefreshResponse>(
    `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`,
    {
      refresh_token: storedRefreshToken,
    }
  );

  const existingEmployee = getStoredEmployee();
  const session = buildSession(data, {
    work_email: existingEmployee?.work_email,
  });

  if (!session) {
    return null;
  }

  persistAuthSession(session);
  return session;
}
