
export interface StandardResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface AppError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}