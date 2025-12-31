import { auth } from "@/lib/firebase/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(false);
}

interface RequestConfig extends Omit<RequestInit, "body"> {
  data?: unknown;
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    { data, headers, ...customConfig }: RequestConfig = {},
  ): Promise<T> {
    const token = await getAuthToken();

    const config: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as HeadersInit),
      },
      ...customConfig,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
          code?: string;
        };
        throw new ApiError(
          errorData.message || response.statusText,
          response.status,
          errorData.code,
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : "An unknown error occurred",
        500,
      );
    }
  },

  get<T>(endpoint: string, params?: Record<string, unknown>) {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined && value !== null) {
                // Handle arrays (e.g., priceRange, tags) by joining with comma
                if (Array.isArray(value)) {
                  acc[key] = value.join(",");
                } else {
                  acc[key] = String(value);
                }
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        ).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`, { method: "GET" });
  },

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: "POST", data });
  },

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: "PUT", data });
  },

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: "PATCH", data });
  },

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  },

  async upload<T>(endpoint: string, formData: FormData) {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      throw new ApiError(
        errorData.message || "Upload failed",
        response.status,
      );
    }

    return (await response.json()) as T;
  },
};