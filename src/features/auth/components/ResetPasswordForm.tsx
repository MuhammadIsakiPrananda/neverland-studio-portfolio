import { useState, useEffect } from "react";
import {
  Lock,
  Loader,
  ShieldX,
  CheckCircle,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { useNotification } from "@/shared/components";
import { authService } from "../services/authService";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  onSuccess,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addNotification } = useNotification();

  // Verify token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await authService.verifyResetToken(token);
        setTokenValid(result.valid);
        if (!result.valid) {
          setError("Password reset link is invalid or has expired.");
        }
      } catch (err: any) {
        setError("Password reset link is invalid or has expired.");
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (): boolean => {
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    // Basic password complexity check
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
      setError(
        "Password must contain uppercase, lowercase, numbers, and special characters."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(
        token,
        password,
        confirmPassword
      );

      addNotification(
        "Success",
        response.message || "Your password has been reset successfully!",
        "success"
      );
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.msg ||
        err.message ||
        "Failed to reset password. Please try again.";
      setError(errorMessage);
      addNotification("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full animate-fade-in text-center p-8">
        <Loader className="w-8 h-8 animate-spin mx-auto text-violet-400 mb-4" />
        <p className="text-slate-400">Verifying reset link...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="w-full animate-fade-in text-center p-8">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-red-500/10 rounded-full border-2 border-red-500/20">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Link Expired</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          {error ||
            "This password reset link is invalid or has expired. Please request a new one."}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full animate-fade-in text-center p-8">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-violet-500/10 rounded-full border-2 border-violet-500/20">
          <CheckCircle className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Password Reset</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Your password has been reset successfully. You will be redirected to
          the login page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Reset Password</h2>
        <p className="text-slate-400 mt-2">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-xl flex items-start gap-3 animate-shake">
            <ShieldX className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-950/50 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all disabled:opacity-50 ${
                error ? "border-red-500/50" : "border-white/10 hover:border-white/20"
              }`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {password && <PasswordStrengthMeter password={password} />}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-slate-950/50 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all disabled:opacity-50 ${
                error ? "border-red-500/50" : "border-white/10 hover:border-white/20"
              }`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {password && confirmPassword && (
            <div className="mt-2">
              {password === confirmPassword ? (
                <p className="text-xs text-violet-400">✓ Passwords match</p>
              ) : (
                <p className="text-xs text-red-400">✗ Passwords do not match</p>
              )}
            </div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-black/20 border border-white/5 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-300 mb-2">
            Password requirements:
          </p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li
              className={
                password.length >= 8 ? "text-violet-400" : "text-slate-400"
              }
            >
              ✓ At least 8 characters
            </li>
            <li
              className={
                /[A-Z]/.test(password) ? "text-violet-400" : "text-slate-400"
              }
            >
              ✓ One uppercase letter
            </li>
            <li
              className={
                /[a-z]/.test(password) ? "text-violet-400" : "text-slate-400"
              }
            >
              ✓ One lowercase letter
            </li>
            <li
              className={
                /\d/.test(password) ? "text-violet-400" : "text-slate-400"
              }
            >
              ✓ One number
            </li>
            <li
              className={
                /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                  ? "text-violet-400"
                  : "text-slate-400"
              }
            >
              ✓ One special character (!@#$%^&* etc.)
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" /> Resetting...
            </>
          ) : (
            <>
              <RotateCcw className="w-5 h-5" /> Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
