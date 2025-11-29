import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import TermsModal from './TermsModal';

type AuthMode = 'login' | 'register' | 'forgotPassword';

interface AuthContainerProps {
  onLoginSuccess: (user: any, rememberMe: boolean) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const handleAgreeToTerms = () => {
    setAgreedToTerms(true);
    setIsTermsModalOpen(false);
  };

  const renderContent = () => {
    // Tampilkan form berdasarkan mode saat ini
    switch (mode) {
      case 'register':
        return <RegisterForm onSwitchMode={() => handleSwitchMode('login')} onRegisterSuccess={onLoginSuccess} />;
      case 'forgotPassword':
        return <ForgotPasswordForm onSwitchMode={() => handleSwitchMode('login')} />;
      case 'login':
      default:
        return <LoginForm 
          onLoginSuccess={onLoginSuccess} 
          onSwitchMode={handleSwitchMode}
          onOpenTerms={() => setIsTermsModalOpen(true)}
          agreedToTerms={agreedToTerms}
          setAgreedToTerms={setAgreedToTerms}
        />;
    }
  };

  return (
    <>
      {renderContent()}
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} onAgree={handleAgreeToTerms} />
    </>
  );
};

export default AuthContainer;