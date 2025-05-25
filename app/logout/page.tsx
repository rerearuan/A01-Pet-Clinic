'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutPage() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setShowConfirm(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/dashboard');
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
          <h2 className="text-2xl font-bold text-gray-800">Are you sure want to logout?</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Yes
            </button>
            <button
              onClick={handleCancel}
              className="bg-white border border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold px-6 py-2 rounded-lg transition"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
