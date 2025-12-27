import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { showSuccess, showError } from '../common/ModernNotification';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading');
  const [message, setMessage] = useState('Authenticating...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Check for OAuth cancellation or access_denied
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error === 'access_denied' || errorDescription?.includes('denied') || errorDescription?.includes('cancelled')) {
        setStatus('cancelled');
        setMessage('Login cancelled');
        
        // Set flag to reopen login modal
        localStorage.setItem('reopenLoginModal', 'true');
        
        // Redirect back to home
        setTimeout(() => {
          navigate('/home');
        }, 1500);
        return;
      }
      
      // Check for other errors from backend
      if (error) {
        throw new Error(errorDescription || error);
      }

      // Get success flag
      const success = searchParams.get('success');
      if (success !== 'true') {
        throw new Error('Authentication was not successful');
      }

      // Get token and user data from URL
      const token = searchParams.get('token');
      const userStr = searchParams.get('user');

      if (!token || !userStr) {
        throw new Error('Missing authentication data');
      }

      // Parse user data
      const user = JSON.parse(userStr);

      // Store authentication data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('auth_mode', 'backend');
      
      setStatus('success');
      setMessage('Authentication successful! Redirecting...');
      
      showSuccess(
        'Login Successful! 🎉',
        `Welcome ${user.name}!`
      );

      // Redirect to homepage
      setTimeout(() => {
        navigate('/home');
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');

      showError(
        'Authentication Failed',
        error.message || 'Please try again'
      );

      // Set flag to reopen login modal
      localStorage.setItem('reopenLoginModal', 'true');

      // Redirect back to home
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Authenticating
              </h2>
              <p className="text-slate-400 text-sm">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Success!
              </h2>
              <p className="text-slate-400 text-sm">{message}</p>
            </>
          )}

          {status === 'cancelled' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Login Cancelled
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                You cancelled the login process
              </p>
              <p className="text-slate-500 text-xs">
                Redirecting back to login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-slate-400 text-sm mb-4">{message}</p>
              <p className="text-slate-500 text-xs">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
