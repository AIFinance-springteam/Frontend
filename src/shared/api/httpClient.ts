import axios from "axios";
import type { ApiResponse } from "./types";
import { tokenStorage } from "./tokenStorage";

const API_BASE_URL = "http://localhost:8080";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    return { ...response, data: body.result };
  },
  (error) => {
    const body = error.response?.data as ApiResponse<unknown> | undefined;
    return Promise.reject({
      status: error.response?.status,
      code: body?.code ?? "UNKNOWN_ERROR",
      message: body?.message ?? "알 수 없는 오류가 발생했습니다.",
    });
  },
);
