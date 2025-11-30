import { useState } from 'react';

export type AuthProvider = 'google' | 'github' | 'facebook' | 'linkedin';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState<AuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initiateLogin = (provider: AuthProvider) => {
    setIsLoading(provider);
    setError(null);

    // Ambil URL dasar backend dari variabel lingkungan Vite.
    // Ini harusnya 'http://localhost:5000' sesuai file .env Anda.
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    if (!backendUrl) {
      const msg = 'VITE_API_BASE_URL tidak terdefinisi di file .env. Tidak bisa menghubungi backend.';
      console.error(msg);
      alert(msg);
      setError(msg);
      setIsLoading(null);
      return;
    }

    let authUrl = '';

    // Logika yang benar: Cukup arahkan ke endpoint backend yang sesuai.
    // Backend akan menangani semua komunikasi dengan penyedia OAuth.
    if (provider === 'google' || provider === 'github') {
      authUrl = `${backendUrl}/api/auth/${provider}`;
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