'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function UpdatePet() {
  const { key } = useParams();
  const [pet, setPet] = useState<{
    pemilik: string;
    jenis: string;
    nama: string;
    tanggal_lahir: string;
    url_foto: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Dummy fetch by key
    setPet({
      pemilik: 'John Doe',
      jenis: 'Kucing',
      nama: 'Snowy',
      tanggal_lahir: '2020-02-09',
      url_foto: 'https://example.com/snowy.jpg',
    });
  }, [key]);

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const handleUpdate = () => {
    // TODO: PUT /api/hewan-peliharaan/[key]
    router.push('/hewan-peliharaan');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Pet</h1>
          <Link href="/hewan-peliharaan" className="text-gray-500 hover:text-gray-700">
            Back
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Pemilik</label>
            <input
              type="text"
              value={pet.pemilik}
              disabled
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Jenis Hewan</label>
            <input
              type="text"
              value={pet.jenis}
              onChange={e => setPet({ ...pet, jenis: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Hewan</label>
            <input
              type="text"
              value={pet.nama}
              onChange={e => setPet({ ...pet, nama: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={pet.tanggal_lahir}
              onChange={e => setPet({ ...pet, tanggal_lahir: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto</label>
            <input
              type="text"
              value={pet.url_foto}
              onChange={e => setPet({ ...pet, url_foto: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:opacity-90"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}