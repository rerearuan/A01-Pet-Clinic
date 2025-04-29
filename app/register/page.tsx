'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '../../components/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const roles = [
    { id: 'front-desk-officer', name: 'Front Desk Officer', category: 'Pegawai' },
    { id: 'dokter-hewan',         name: 'Dokter Hewan',        category: 'Pegawai' },
    { id: 'perawat-hewan',       name: 'Perawat Hewan',      category: 'Pegawai' },
    { id: 'individu',            name: 'Klien Individu',     category: 'Klien'   },
    { id: 'perusahaan',          name: 'Klien Perusahaan',   category: 'Klien'   }
  ];

  const grouped = roles.reduce<Record<string, typeof roles>>((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pilih Kategori Registrasi</h1>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map(r => (
                <button
                  key={r.id}
                  onClick={() => router.push(`/register/${r.id}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-shadow shadow-md"
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}