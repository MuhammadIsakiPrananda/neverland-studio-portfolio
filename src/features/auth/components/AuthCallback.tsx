import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserProfileSchema } from '@/features/auth'; // Pastikan path ini benar
import { Loader } from 'lucide-react';

const AuthCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Hapus query params dari URL untuk keamanan sesegera mungkin
      window.history.replaceState(null, '', location.pathname);

      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const userParam = params.get('user');

      if (token && userParam) {
        try {
          // 1. Decode dan parse data pengguna dari URL
          const potentialUser = JSON.parse(decodeURIComponent(userParam));

          // 2. Validasi data pengguna menggunakan Zod. Ini adalah langkah keamanan krusial.
          const validationResult = UserProfileSchema.safeParse(potentialUser);
          if (!validationResult.success) {
            // Jika data tidak valid, lempar error untuk ditangkap oleh blok catch
            throw new Error('Invalid user data received from server.');
          }
          const validUser = validationResult.data;

          // 3. Update state global dan simpan data ke storage melalui AuthContext
          await login(validUser, token, false); // Anggap 'remember me' false

          // 4. Arahkan ke halaman utama setelah login berhasil
          navigate('/');
        } catch (err) {
          setError('Gagal memproses data pengguna. Silakan coba login kembali.');
        }
      } else {
        setError('Token otentikasi atau data pengguna tidak ditemukan.');
      }
    };

    // Mencegah eksekusi ganda di React StrictMode (development)
    let isCancelled = false;

    if (!isCancelled) {
      handleAuthCallback();
    }

    // Fungsi cleanup untuk useEffect
    return () => {
      isCancelled = true;
    };
  }, [location.search, navigate, login]); // location.search lebih spesifik

  useEffect(() => {
    if (error) {
      // Arahkan kembali ke halaman login jika terjadi error
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      {error ? <p className="text-red-400">Error: {error}</p> : <Loader className="w-8 h-8 animate-spin text-amber-500" />}
      <p className="mt-4">{error ? 'Redirecting to login...' : 'Finalizing authentication...'}</p>
    </div>
  );
};

export default AuthCallback;