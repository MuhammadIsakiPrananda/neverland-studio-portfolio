import { useState } from "react";
import {
  Mail,
  Send,
  Loader,
  ShieldX,
  MailCheck,
  ArrowLeft,
} from "lucide-react";
import { useNotification } from "@/shared/components";

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: "login") => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchMode,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Email address is required.");
      return;
    }
    setIsLoading(true);

    // --- API Call Placeholder ---
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      // Ganti dengan API call Anda
      addNotification(
        "Request Sent",
        `If an account exists for ${email}, you will receive a password reset link.`,
        "success"
      );
      setIsSubmitted(true);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      addNotification("Request Failed", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {isSubmitted ? (
        <div key="success" className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-green-500/10 rounded-full border-2 border-green-500/20">
            <MailCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Check Your Inbox</h2>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            A password reset link has been sent to <br />
            <span className="font-semibold text-amber-400">{email}</span>
            <br /> if it's associated with an account.
          </p>
          <button
            onClick={() => onSwitchMode("login")}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>
      ) : (
        <div key="form">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-amber-400">
              Forgot Password?
            </h2>
            <p className="text-slate-400 mt-2">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/40 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-3 animate-shake">
                <ShieldX className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label
                htmlFor="email-forgot"
                className="text-sm font-medium text-slate-400 mb-2 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email-forgot"
                  type="email"
                  placeholder="Enter your account email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-800/60 border rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none transition-all disabled:opacity-50 ${
                    error ? "border-red-500/50" : "border-slate-700"
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Reset Link
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-400 pt-4">
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className="font-semibold text-amber-400 hover:underline disabled:opacity-50 inline-flex items-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
