import { useState } from "react";
import { useNotification } from "@/shared/components";

export type AuthProvider = "google" | "github";

/**
 * Custom hook untuk menangani alur autentikasi sosial (OAuth).
 * Google menggunakan redirect flow (handled by backend).
 * GitHub menggunakan redirect flow (handled by backend).
 */
export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const { addNotification } = useNotification();

  const initiateLogin = (provider: AuthProvider): void => {
    setIsLoading(provider);

    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.PROD
          ? "https://api.neverlandstudio.my.id"
          : "http://localhost:5000");

      // Both Google and GitHub use redirect-based OAuth (backend handles the flow)
      // The backend will redirect back to the frontend with token and user data
      window.location.href = `${apiBaseUrl}/api/auth/${provider}`;
    } catch (error) {
      addNotification(
        "Authentication Error",
        error instanceof Error ? error.message : "An unknown error occurred.",
        "error"
      );
      setIsLoading(null);
    }
  };

  return { initiateLogin, isLoading };
};
