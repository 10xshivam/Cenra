import axios, { AxiosError } from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.error) {
      return Promise.reject(
        new Error(response.data.error.message || "An API error occurred.")
      );
    }
    return response;
  },
  (error: AxiosError) => {
    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An unknown network error occurred.";
    return Promise.reject(new Error(errorMessage));
  }
);
