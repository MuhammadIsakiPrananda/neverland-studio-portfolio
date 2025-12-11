import { useState } from 'react';

export type AuthProvider = 'google' | 'github' | 'facebook' | 'linkedin';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initiateLogin = (provider: AuthProvider) => {
    setIsLoading(provider);
    setError(null);

    // Gunakan relative URL agar support both development dan production
    // Di development: /api/auth/google => localhost:5000/api/auth/google (via proxy)
    // Di production: /api/auth/google => api.neverlandstudio.my.id/api/auth/google (via nginx)
    let authUrl = '';

    // Logika yang benar: Gunakan relative URL ke backend
    // Backend akan handle semua komunikasi dengan penyedia OAuth
    if (provider === 'google' || provider === 'github') {
      authUrl = `/api/auth/${provider}`;
      console.log(`🔐 Initiating ${provider} login with URL: ${authUrl}`);
    } else {
      const msg = `Login dengan ${provider} belum didukung.`;
      console.error(msg);
      setError(msg);
      setIsLoading(null);
      return;
    }

    // Mengarahkan pengguna ke halaman otentikasi
    window.location.href = authUrl;
  };

  return { initiateLogin, isLoading: isLoading as AuthProvider | null, error };
};