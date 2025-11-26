import { useState } from 'react';

export type AuthProvider = 'google' | 'github' | 'facebook' | 'linkedin';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initiateLogin = (provider: AuthProvider) => {
    setIsLoading(provider);
    setError(null);

    // URL tempat penyedia otentikasi akan mengarahkan pengguna kembali setelah login.
    // Pastikan URL ini terdaftar di Google Cloud Console dan Pengaturan Aplikasi GitHub Anda.
    // Biasanya ini adalah halaman khusus seperti /auth/callback
    const redirectUri = `${window.location.origin}/auth/callback`;

    let authUrl = '';

    switch (provider) {
      case 'google': {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) {
          const msg = 'VITE_GOOGLE_CLIENT_ID is not defined in .env file. Google login is not configured.';
          console.error(msg);
          alert(msg);
          setError(msg);
          setIsLoading(null);
          return;
        }
        const params = new URLSearchParams({
          client_id: googleClientId,
          redirect_uri: redirectUri,
          response_type: 'code',
          scope: 'openid profile email',
          access_type: 'offline',
          prompt: 'consent',
        });
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        break;
      }

      case 'github': {
        const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        if (!githubClientId) {
          const msg = 'VITE_GITHUB_CLIENT_ID is not defined in .env file. GitHub login is not configured.';
          console.error(msg);
          alert(msg);
          setError(msg);
          setIsLoading(null);
          return;
        }
        const params = new URLSearchParams({
          client_id: githubClientId,
          redirect_uri: redirectUri,
          scope: 'read:user user:email',
        });
        authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
        break;
      }

      // Anda bisa menambahkan case untuk 'facebook' di sini jika diperlukan
      default:
        const msg = `Login with ${provider} is not supported yet.`;
        console.error(msg);
        alert(msg);
        setError(msg);
        setIsLoading(null);
        return;
    }

    // Mengarahkan pengguna ke halaman otentikasi
    window.location.href = authUrl;
  };

  return { initiateLogin, isLoading, error };
};