// 🔹 Standard API response
export interface StandardResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 🔹 Pagination structure
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 🔹 Error structure
export interface AppError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}