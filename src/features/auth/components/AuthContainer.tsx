import { useState } from "react";
import { LoginForm, RegisterForm } from "@/shared/components";
import ForgotPasswordForm from "./ForgotPasswordForm";

type AuthMode = "login" | "register" | "forgotPassword";

interface AuthContainerProps {
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const renderContent = () => {
    // Tampilkan form berdasarkan mode saat ini
    switch (mode) {
      case "register":
        return (
          <RegisterForm
            onSwitchMode={() => handleSwitchMode("login")}
            onRegisterSuccess={onLoginSuccess}
          />
        );
      case "forgotPassword":
        return (
          <ForgotPasswordForm onSwitchMode={() => handleSwitchMode("login")} />
        );
      case "login":
      default:
        return (
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            // Mengirim fungsi spesifik untuk setiap aksi
            onSwitchToRegister={() => handleSwitchMode("register")}
            onSwitchToForgotPassword={() => handleSwitchMode("forgotPassword")}
          />
        );
    }
  };

  return <>{renderContent()}</>;
};

export default AuthContainer;
