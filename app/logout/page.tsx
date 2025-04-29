'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>

        <button
          onClick={() => setShowConfirmLogout(true)}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Logout
        </button>

        {/* Modal popup */}
        {showConfirmLogout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4 text-center">Yakin mau logout?</h2>
              <div className="flex justify-around">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Ya
                </button>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                >
                  Tidak
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
