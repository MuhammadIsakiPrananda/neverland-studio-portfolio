import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      // If no token, redirect to home
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleSuccess = () => {
    // After successful password reset, navigate to home and open login modal
    navigate("/?login=true", { replace: true });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
        <ResetPasswordForm token={token} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
