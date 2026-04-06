export interface DecodedToken {
  employee_id: number;
  role: string;
  exp: number;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as DecodedToken;
  } catch {
    return null;
  }
}