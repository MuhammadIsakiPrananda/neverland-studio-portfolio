import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthContainerProps {
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  // Tampilkan form berdasarkan mode saat ini
  switch (mode) {
    case 'register':
      return <RegisterForm onSwitchMode={() => handleSwitchMode('login')} onRegisterSuccess={onLoginSuccess} />;
    case 'forgotPassword':
      return <ForgotPasswordForm onSwitchMode={() => handleSwitchMode('login')} />;
    case 'login':
    default:
      return <LoginForm onLoginSuccess={onLoginSuccess} onSwitchMode={handleSwitchMode} />;
  }
};

export default AuthContainer;