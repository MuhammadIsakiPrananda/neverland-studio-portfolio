/**
 * Auth Feature - Public API
 * Barrel export for authentication module
 */

// Components
export { default as AuthModal } from "./components/AuthModal";
export { default as AuthContainer } from "./components/AuthContainer";
export { default as SocialLoginButtons } from "./components/SocialLoginButtons";
export { default as ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { default as ResetPasswordForm } from "./components/ResetPasswordForm";
export { default as PasswordStrengthMeter } from "./components/PasswordStrengthMeter";

// Pages
export { default as AccessDenied } from "./pages/AccessDenied";
export { default as ResetPasswordPage } from "./pages/ResetPasswordPage";

// Context & Hooks
export {
  AuthProvider,
  useAuth,
  UserProfileSchema,
} from "./context/AuthContext";
export type { UserProfile, AuthContextType } from "./context/AuthContext";

// Services
export * from "./services/authService";
