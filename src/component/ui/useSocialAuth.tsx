import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '@/component/ui/useNotification';
import { User } from '@/types/user'; // Asumsi Anda memiliki tipe User

export type AuthProvider = 'google' | 'github' | 'linkedin';

// Mengambil Client ID langsung dari environment variables yang diekspos oleh Vite.
const OAUTH_CLIENT_IDS = {
  github: import.meta.env.VITE_GITHUB_CLIENT_ID,
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  linkedin: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
};

/**
 * Custom hook untuk menangani alur autentikasi sosial (OAuth) menggunakan popup.
 * @param onLoginSuccess - Callback yang dipanggil saat login berhasil.
 */
export const useSocialAuth = (onLoginSuccess: (user: User, provider: AuthProvider) => void) => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const { addNotification } = useNotification();

  const handleAuthMessage = useCallback((event: MessageEvent) => {
    // Pastikan pesan berasal dari sumber yang diharapkan (jendela popup Anda)
    // Untuk keamanan, Anda harus memeriksa event.origin
    // if (event.origin !== window.location.origin) return;

    const { type, provider, user, error } = event.data;

    if (type === 'auth-success' && provider && user) {
      setIsLoading(null);
      onLoginSuccess(user, provider);
      addNotification('Login Successful', `Welcome back, ${user.name}!`, 'success');
    } else if (type === 'auth-error' && provider && error) {
      setIsLoading(null);
      addNotification('Login Failed', `Could not log in with ${provider}: ${error}`, 'error');
    }
  }, [addNotification, onLoginSuccess]);

  useEffect(() => {
    window.addEventListener('message', handleAuthMessage);
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [handleAuthMessage]);

  const initiateLogin = (provider: AuthProvider): void => {
    setIsLoading(provider);

    try {
      const clientId = OAUTH_CLIENT_IDS[provider];
      if (!clientId || clientId.startsWith('isi_') || clientId.startsWith('YOUR_')) {
        throw new Error(`Client ID for ${provider} is not configured. Please check your .env file.`);
      }

      let authUrl = '';
      const redirectUri = `${window.location.origin}/auth/callback?provider=${provider}`;

      const popup = window.open(
        '',
        '_blank',
        'width=600,height=700,left=100,top=100'
      );

      if (!popup) {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }

      // Monitor jika popup ditutup oleh pengguna
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          // Hanya set loading ke null jika masih provider yang sama
          setIsLoading(currentProvider => {
            if (currentProvider === provider) {
              return null;
            }
            return currentProvider;
          });
        }
      }, 500);

      // Menulis konten loading ke dalam popup
      popup.document.write(`
        <div style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #111827; color: #e5e7eb;">
          <h2>Redirecting to ${provider}...</h2>
        </div>
      `);

      switch (provider) {
        case 'github':
          authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
          break;
        case 'google':
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
          break;
        case 'linkedin':
          // LinkedIn uses a 'state' parameter for CSRF protection
          const csrfToken = Math.random().toString(36).substring(2);
          sessionStorage.setItem('linkedin_csrf_token', csrfToken);
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${csrfToken}&scope=profile%20email%20openid`;
          break;
        default:
          // This case is for type safety and should not be reached.
          throw new Error(`Provider ${provider} is not supported.`);
      }

      // Mengarahkan popup ke URL otentikasi
      popup.location.href = authUrl;
    } catch (error) {
      addNotification('Authentication Error', error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
      setIsLoading(null);
    }
  };

  return { initiateLogin, isLoading };
};