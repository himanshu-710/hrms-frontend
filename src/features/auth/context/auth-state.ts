import { createContext } from "react";
import type {
  AuthState,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/types/auth.types";

export interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
