import { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Lock,
  Mail,
  LogIn,
  Loader,
  Eye,
  EyeOff,
  ShieldX,
  AtSign,
} from "lucide-react";
import { useNotification } from "../ui/useNotification";
import { PasswordStrengthMeter } from "@/features/auth";
import ReCAPTCHA from "react-google-recaptcha";

interface RegisterFormProps {
  onSwitchMode: (mode: "login") => void;
  onRegisterSuccess: (user: any, rememberMe: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchMode,
  onRegisterSuccess,
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState<string | null>(null);
  const [loadingRecaptcha, setLoadingRecaptcha] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
    lockoutTime: 0,
  });
  const [errors, setErrors] = useState<
    Partial<typeof formData> & { agreedToTerms?: string }
  >({});
  const { addNotification } = useNotification();

  // Fetch reCAPTCHA site key dari backend saat component mount
  useEffect(() => {
    const fetchRecaptchaKey = async () => {
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${apiBaseUrl}/api/config/recaptcha`);
        const data = await response.json();

        if (response.ok && data.success && data.siteKey) {
          setRecaptchaSiteKey(data.siteKey);
        } else {
          console.warn(
            "reCAPTCHA config issue from backend, using env fallback:",
            data
          );
          // Fallback: Use environment variable if backend fails
          const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
          if (envSiteKey) {
            setRecaptchaSiteKey(envSiteKey);
          }
        }
      } catch (error) {
        console.error(
          "Failed to connect to backend for reCAPTCHA, using env fallback:",
          error
        );
        // Fallback: Use environment variable if backend is unreachable
        const envSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        if (envSiteKey) {
          setRecaptchaSiteKey(envSiteKey);
        }
      } finally {
        setLoadingRecaptcha(false);
      }
    };

    fetchRecaptchaKey();
  }, []);

  // Effect to manage the lockout timer
  useEffect(() => {
    if (status.lockoutTime > 0) {
      const timer = setInterval(() => {
        setStatus((prev) => {
          const newTime = prev.lockoutTime - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            return { ...prev, loading: false, error: null, lockoutTime: 0 };
          }
          return { ...prev, lockoutTime: newTime };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status.lockoutTime]);

  const validate = (field?: keyof typeof formData) => {
    const newErrors: Partial<typeof formData> & { agreedToTerms?: string } = {
      ...errors,
    };
    const { name, username, email, password, confirmPassword } = formData;

    const validateField = (key: keyof typeof formData) => {
      switch (key) {
        case "name":
          newErrors.name = name ? undefined : "Name is required.";
          break;
        case "username":
          newErrors.username = username ? undefined : "Username is required.";
          break;
        case "email":
          if (!email) {
            newErrors.email = "Email is required.";
          } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email address is invalid.";
          } else {
            newErrors.email = undefined;
          }
          break;
        case "password":
          if (!password) {
            newErrors.password = "Password is required.";
          } else {
            const passwordErrors = [];
            if (password.length < 8)
              passwordErrors.push("at least 8 characters");
            if (!/[a-z]/.test(password))
              passwordErrors.push("a lowercase letter");
            if (!/[A-Z]/.test(password))
              passwordErrors.push("an uppercase letter");
            if (!/[0-9]/.test(password)) passwordErrors.push("a number");
            if (!/[@$!%*?&#]/.test(password))
              passwordErrors.push("a special character (@$!%*?&#)");
            newErrors.password =
              passwordErrors.length > 0
                ? `Must contain ${passwordErrors.join(", ")}.`
                : undefined;
          }
          break;
        case "confirmPassword":
          newErrors.confirmPassword =
            password !== confirmPassword
              ? "Passwords do not match."
              : undefined;
          break;
        default:
          break;
      }
    };

    if (field) {
      validateField(field);
    } else {
      // Validate all fields if no specific field is provided
      (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) =>
        validateField(key)
      );
      // Validasi tambahan untuk persetujuan syarat dan ketentuan
      if (!agreedToTerms) {
        newErrors.agreedToTerms = "You must agree to the terms and conditions.";
      } else {
        newErrors.agreedToTerms = undefined;
      }
    }

    setErrors(newErrors);
    // Return true if no error messages are present after validation
    return Object.values(newErrors).every((error) => error === undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear the specific error when user starts typing
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setAgreedToTerms(isChecked);
    if (isChecked) {
      setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validate(e.target.id as keyof typeof formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset status setiap kali form di-submit
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    // Run full validation on submit
    if (!validate() || !recaptchaRef.current) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Please complete all fields and the reCAPTCHA.",
      }));
      return;
    }

    // Reset validation errors
    setErrors({});

    let recaptchaToken: string | null = null;
    try {
      // Gunakan getValue() untuk reCAPTCHA v2 (checkbox)
      recaptchaToken = recaptchaRef.current.getValue();
      console.log("reCAPTCHA token obtained:", !!recaptchaToken);

      if (!recaptchaToken) {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: "Please verify the reCAPTCHA checkbox.",
        }));
        return;
      }
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to get reCAPTCHA token.",
      }));
      return;
    }

    try {
      console.log("Sending registration request with reCAPTCHA token...");

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`;
      const requestBody = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        recaptchaToken,
      };

      console.log("Request body keys:", Object.keys(requestBody));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json(); // Pastikan kita menunggu parsing JSON selesai
      console.log(
        "Response status:",
        response.status,
        "Success:",
        data.success
      );

      if (!response.ok) {
        // Jika response dari server adalah error (4xx atau 5xx)
        const errorMsg = data.msg || "An error occurred during registration.";
        console.error("Registration error:", errorMsg, data);
        throw new Error(errorMsg);
      }

      // Defensive check untuk memastikan objek user ada sebelum melanjutkan
      if (!data.user) {
        console.error(
          "Registration error: User object not found in the successful response."
        );
        throw new Error("User data is missing from the server response.");
      }

      // Jika registrasi berhasil
      addNotification(
        "Registration Successful",
        `Welcome, ${data.user.name}! You are now logged in.`,
        "success"
      );

      // Store token di localStorage jika ada
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Panggil onRegisterSuccess agar pengguna langsung login
      // Gunakan setTimeout untuk memastikan state saat ini selesai sebelum memicu update global.
      // Ini mencegah race condition di mana komponen lain mencoba mengakses user sebelum state diperbarui.
      const loginPayload = { user: { ...data.user }, token: data.token }; // Create a stable payload
      setTimeout(() => {
        onRegisterSuccess(loginPayload, false); // Pass the payload that handleLoginSuccess expects
      }, 0);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during registration.";
      console.error("Registration exception:", errorMessage);

      // Check if the error is due to rate limiting
      if (errorMessage.includes("Too many attempts")) {
        const lockoutSeconds = 900; // 15 minutes, as per backend config
        setStatus({
          loading: false,
          error: `Too many attempts. Please try again in ${Math.ceil(
            lockoutSeconds / 60
          )} minutes.`,
          lockoutTime: lockoutSeconds,
        });
      } else {
        setStatus({ loading: false, error: errorMessage, lockoutTime: 0 });
      }

      // Reset reCAPTCHA pada error
      if (recaptchaRef.current) {
        console.log("Resetting reCAPTCHA after error");
        recaptchaRef.current.reset();
      }
    }
  };

  const isFormDisabled = status.loading || status.lockoutTime > 0;
  const minutesLeft = Math.ceil(status.lockoutTime / 60);
  const secondsLeft = status.lockoutTime % 60;
  const lockoutMessage = `Try again in ${
    minutesLeft > 0 ? `${minutesLeft}m ` : ""
  }${secondsLeft}s`;

  return (
    <div key="register" className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-400">Create an Account</h2>
        <p className="text-slate-400 mt-2">Join us and start your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status.error && (
          <div className="bg-red-900/40 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-3 animate-shake">
            <ShieldX className="w-5 h-5 flex-shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="name"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                errors.name
                  ? "border-red-500/50"
                  : "border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              }`}
              required
              disabled={isFormDisabled}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.name}
            </p>
          )}
        </div>

        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="username"
              type="text"
              placeholder="e.g. alexj"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                errors.username
                  ? "border-red-500/50"
                  : "border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              }`}
              required
              disabled={isFormDisabled}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="email"
              type="email"
              placeholder="e.g. alex@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                errors.email
                  ? "border-red-500/50"
                  : "border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              }`}
              required
              disabled={isFormDisabled}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                errors.password
                  ? "border-red-500/50"
                  : "border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              }`}
              required
              disabled={isFormDisabled}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.password}
            </p>
          )}
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-400 mb-2 block"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50 ${
                errors.confirmPassword
                  ? "border-red-500/50"
                  : "border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              }`}
              required
              disabled={isFormDisabled}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="pt-2">
          {recaptchaSiteKey ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              theme="dark"
              size="normal"
            />
          ) : (
            <div className="bg-yellow-900/40 border border-yellow-500/30 text-yellow-300 text-sm p-3 rounded-lg">
              {loadingRecaptcha ? (
                <span>Loading reCAPTCHA...</span>
              ) : (
                <>
                  reCAPTCHA could not be loaded. The server did not provide a
                  site key. Please check the backend configuration.
                </>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree-terms-register"
              checked={agreedToTerms}
              onChange={handleAgreeChange}
              disabled={isFormDisabled}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
            />
            <label
              htmlFor="agree-terms-register"
              className="text-sm text-slate-400 select-none"
            >
              I agree to the{" "}
              <button type="button" className="text-amber-400 hover:underline">
                Terms & Conditions
              </button>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-xs text-red-400 mt-1.5 ml-1 animate-fade-in">
              {errors.agreedToTerms}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {status.loading && (
            <>
              <Loader className="w-5 h-5 animate-spin" /> Creating Account...
            </>
          )}
          {!status.loading && status.lockoutTime > 0 && (
            <>
              <Loader className="w-5 h-5 animate-spin" /> {lockoutMessage}
            </>
          )}
          {!status.loading && status.lockoutTime <= 0 && (
            <>
              <LogIn className="w-5 h-5" /> Sign Up
            </>
          )}
        </button>
      </form>

      <div className="pt-5 mt-5 border-t border-slate-700/50 relative z-10">
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className="font-semibold text-amber-400 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
