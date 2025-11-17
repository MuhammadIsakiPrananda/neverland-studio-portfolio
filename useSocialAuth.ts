import { useState } from 'react';
import { useNotification } from '@/component/ui/useNotification';

export type AuthProvider = 'google' | 'github' | 'linkedin';

// Di aplikasi nyata, ini harus disimpan di environment variables (.env)
// dan tidak di-hardcode seperti ini.
const OAUTH_CLIENT_IDS = {
  github: 'YOUR_GITHUB_CLIENT_ID', // Ganti dengan Client ID GitHub Anda
  google: 'YOUR_GOOGLE_CLIENT_ID', // Ganti dengan Client ID Google Anda
  linkedin: 'YOUR_LINKEDIN_CLIENT_ID', // Ganti dengan Client ID LinkedIn Anda
};

/**
 * Custom hook untuk menangani alur otentikasi sosial (OAuth).
 * Mengelola state loading dan mengarahkan pengguna ke URL otentikasi provider.
 */
export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const { addNotification } = useNotification();

  const initiateLogin = (provider: AuthProvider) => {
    setIsLoading(provider);

    try {
      let authUrl = '';
      // URL ini adalah tempat provider akan mengarahkan pengguna kembali setelah login.
      // Anda perlu membuat halaman/route untuk menanganinya.
      const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

      switch (provider) {
        case 'github':
          authUrl = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_IDS.github}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
          break;
        case 'google':
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAUTH_CLIENT_IDS.google}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
          break;
        case 'linkedin':
          // LinkedIn menggunakan 'state' untuk keamanan CSRF
          const csrfToken = Math.random().toString(36).substring(2);
          sessionStorage.setItem('linkedin_csrf_token', csrfToken);
          authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${OAUTH_CLIENT_IDS.linkedin}&redirect_uri=${redirectUri}&state=${csrfToken}&scope=profile%20email%20openid`;
          break;
        default:
          throw new Error(`Provider ${provider} tidak didukung.`);
      }

      // Arahkan pengguna ke halaman otentikasi
      window.location.href = authUrl;
    } catch (error) {
      addNotification('Authentication Error', error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
      setIsLoading(null);
    }
  };

  return { initiateLogin, isLoading };
};