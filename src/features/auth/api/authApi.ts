import { httpClient } from "../../../shared/api/httpClient";

export type CurrentUser = { userId: number; email: string; nickname: string };

export async function getCurrentUser() {
  const { data } = await httpClient.get<CurrentUser>("/api/v1/auth/me");
  return data;
}
