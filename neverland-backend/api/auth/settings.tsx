import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DeleteAccountModal } from '@/component/ui/DeleteAccountModal';

// Asumsi: Anda memiliki hook `useAuth` untuk mengelola state otentikasi.
// Jika tidak, Anda bisa menggantinya dengan cara Anda mengambil token dan data user.
// import { useAuth } from '@/hooks/useAuth';

const SettingsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- CONTOH PENGGUNAAN HOOK AUTH ---
  // const { user, token, logout } = useAuth();
  // Jika tidak pakai hook, Anda bisa mengambilnya secara manual:
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login'); // Arahkan ke halaman login
  };
  // ------------------------------------

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    if (!token) {
      setError('Authentication error. Please log in again.');
      setIsDeleting(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        // Body tidak lagi diperlukan karena backend hanya butuh token
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to delete account.');
      }

      // --- INI BAGIAN PENTINGNYA ---
      // Jika API call berhasil (akun terhapus):
      // 1. Tampilkan pesan sukses (opsional)
      alert('Your account has been successfully deleted.');

      // 2. Lakukan proses logout
      logout();
      // Pengguna akan otomatis diarahkan ke halaman login oleh fungsi logout.

    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <div className="mt-8 border-t border-red-500/30 pt-6">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="text-slate-400 text-sm">
          To delete your account, click the button below. This action is irreversible.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 font-semibold"
        >
          Delete My Account
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SettingsPage;