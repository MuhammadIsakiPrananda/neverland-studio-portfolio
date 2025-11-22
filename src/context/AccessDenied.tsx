import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div
        className="bg-gray-800/50 border border-red-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg w-full shadow-2xl shadow-red-900/20 animate-fade-in-up"
      >
        <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">Akses Ditolak</h1>
        <p className="text-slate-300 text-lg mb-8">
          Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini. Area ini hanya untuk administrator.
        </p>
        <Link to="/" className="inline-block bg-cyan-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md shadow-cyan-900/50 hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105">
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;