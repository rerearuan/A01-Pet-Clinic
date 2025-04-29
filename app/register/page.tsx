'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const roles = [
    {
      id: 'front-desk-officer',
      name: 'Front Desk Officer',
      category: 'Pegawai'
    },
    {
      id: 'dokter-hewan',
      name: 'Dokter Hewan',
      category: 'Pegawai'
    },
    {
      id: 'perawat-hewan',
      name: 'Perawat Hewan',
      category: 'Pegawai'
    },
    {
      id: 'individu',
      name: 'Klien Individu',
      category: 'Klien'
    },
    {
      id: 'perusahaan',
      name: 'Klien Perusahaan',
      category: 'Klien'
    }
  ];

  const groupedRoles = roles.reduce<Record<string, typeof roles>>((acc, role) => {
    if (!acc[role.category]) {
      acc[role.category] = [];
    }
    acc[role.category].push(role);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Pilih Kategori Registrasi</h1>
        
        {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => router.push(`/register/${role.id}`)}
                  className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}