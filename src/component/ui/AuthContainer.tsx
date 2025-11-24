import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
// import LoggedInView from './LoggedInView'; // Komponen ini menyebabkan error, dikomentari untuk sementara.
// import ForgotPasswordForm from './ForgotPasswordForm';

// Definisikan tipe User untuk type safety
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Peran sangat penting untuk logika pengalihan
  avatar?: string;
}

const AuthContainer = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Fungsi yang dipanggil setelah login berhasil dari LoginForm
  const handleLoginSuccess = (user: User, rememberMe: boolean) => {
    // --- INI ADALAH LOGIKA UTAMA ---
    // Periksa peran pengguna
    if (user.role === 'admin') {
      // Jika admin, arahkan ke dashboard
      navigate('/dashboard'); 
    } else {
      // Jika pengguna biasa, cukup perbarui state untuk menampilkan LoggedInView
      setLoggedInUser(user);
    }

    if (rememberMe) {
      // Logika untuk menyimpan sesi pengguna (misal: di localStorage) bisa ditambahkan di sini
    }
  };

  // const handleLogout = () => {
  //   setLoggedInUser(null);
  //   setMode('login'); // Kembali ke form login setelah logout
  //   // Logika untuk membersihkan sesi dari localStorage bisa ditambahkan di sini
  // };

  // Jika ada pengguna yang login (dan bukan admin), tampilkan LoggedInView
  if (loggedInUser) {
    // Karena LoggedInView dikomentari, kita return null untuk menghindari error.
    // return <LoggedInView userName={loggedInUser.name} onLogout={handleLogout} />;
    return null;
  }

  // Tampilkan form berdasarkan mode saat ini
  switch (mode) {
    case 'register':
      return <RegisterForm onSwitchMode={() => setMode('login')} onRegisterSuccess={handleLoginSuccess} />;
    // case 'forgotPassword':
    //   return <ForgotPasswordForm onSwitchMode={() => setMode('login')} />;
    case 'login':
    default:
      return <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchMode={(newMode) => setMode(newMode)} />;
  }
};

export default AuthContainer;