'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setShowConfirm(true);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // NextAuth signOut akan otomatis hapus session
      await signOut({ 
        redirect: false, // Jangan auto redirect
        callbackUrl: '/login' // URL setelah logout
      });
      
      // Redirect manual ke login page
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat logout.');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {showConfirm && (
        <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Apakah Anda yakin ingin logout?
          </h2>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
              }`}
            >
              {isLoading ? 'Memproses...' : 'Ya, Logout'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}