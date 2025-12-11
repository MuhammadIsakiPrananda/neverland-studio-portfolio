import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <div
        className="bg-slate-900/60 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-lg w-full shadow-2xl shadow-red-900/20 animate-fade-in-up"
      >
        <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-red-400 mb-4">Akses Ditolak</h1>
        <p className="text-slate-300 text-lg mb-8">
          Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini. Area ini hanya untuk administrator.
        </p>
        <Link to="/" className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105">
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;