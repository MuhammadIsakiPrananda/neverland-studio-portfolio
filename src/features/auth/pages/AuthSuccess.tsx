import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingScreen } from "@/shared/components";
import { useAuth } from "@/features/auth";

/**
 * AuthSuccess Page
 * Handles OAuth callback from backend (Google, GitHub)
 * Extracts token and user data from URL, saves via AuthContext, then redirects to home
 */
const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleAuthSuccess = async () => {
      try {
        // Get parameters from URL
        const authSuccess = searchParams.get("auth_success");
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");

        // Validate auth success
        if (authSuccess !== "true" || !token || !userParam) {
          console.error("Invalid auth callback parameters");
          navigate("/", {
            replace: true,
            state: { error: "Authentication failed. Please try again." },
          });
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));

        // Login via AuthContext (this will update state and localStorage)
        await login(user, token, true); // rememberMe = true for OAuth

        // Show success message
        console.log("Login successful:", user.name);

        // Redirect to home page immediately
        navigate("/", {
          replace: true,
          state: {
            message: `Welcome back, ${user.name}!`,
            authSuccess: true,
          },
        });
      } catch (error) {
        console.error("Error processing auth callback:", error);
        navigate("/", {
          replace: true,
          state: { error: "Failed to process authentication" },
        });
      }
    };

    handleAuthSuccess();
  }, [navigate, searchParams, login]);

  return <LoadingScreen />;
};

export default AuthSuccess;
