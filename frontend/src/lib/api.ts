import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 90000,
});

// ── Token helpers — localStorage ONLY (most reliable, no cookie issues) ──
const TOKEN_KEY = "legal_ai_token";

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ONLY redirect on 401 for protected data calls (analyze, history, report)
// NOT for /me — that call failing should just show empty name, not kick user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url || "";
    const is401 = err.response?.status === 401;
    const isCriticalRoute =
      url.includes("/api/query/") || url.includes("/api/report/");

    if (is401 && isCriticalRoute && typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post("/api/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  getMe: () => api.get("/api/auth/me"),
};

export const queryApi = {
  analyze: (query_text: string) =>
    api.post("/api/query/analyze", { query_text }),
  history: () => api.get("/api/query/history"),
  getById: (id: number) => api.get(`/api/query/${id}`),
  deleteOne: (id: number) => api.delete(`/api/query/${id}`),
  deleteAll: () => api.delete("/api/query/history"),
};

export const reportApi = {
  download: (queryId: number, format: "pdf" | "docx") =>
    api.get(`/api/report/download/${queryId}/${format}`, {
      responseType: "blob",
    }),
};

export default api;
