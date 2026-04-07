interface JwtPayload {
  employee_id: number;
  role: string;
  exp: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(atob(base64));
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}