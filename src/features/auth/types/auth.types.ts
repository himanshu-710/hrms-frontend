export interface Employee {
  id?: number;
  first_name?: string;
  last_name?: string;
  work_email?: string;
  employee_code?: string;
}

export interface AuthState {
  employee: Employee | null;
  accessToken: string | null;
  role: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  work_email: string;
  password: string;
  employee_code: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  employee: Employee;
}

export interface RegisterResponse {
  message: string;
}