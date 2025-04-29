// File: app/register/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const roles = [
    /* Pegawai */
    'front-desk-officer',
    'dokter-hewan',
    'perawat-hewan',
    /* Klien */
    'individu',
    'perusahaan',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 grid grid-cols-2 gap-8 max-w-4xl w-full">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => router.push(`/register/${role}`)}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            {role.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>
    </div>
  );
}