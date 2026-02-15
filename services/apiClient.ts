import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN ?? "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
  },
  timeout: 15000,
});

// Response interceptor — Directus her zaman { data: ... } döner
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.errors?.[0]?.message ??
      error.message ??
      "Bilinmeyen bir hata oluştu.";
    return Promise.reject(new Error(message));
  },
);
