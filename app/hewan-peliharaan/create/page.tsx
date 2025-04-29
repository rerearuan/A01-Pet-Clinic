'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '../../../components/Icons';

export default function CreatePet() {
  const [pemilik, setPemilik] = useState('');
  const [jenis, setJenis] = useState('');
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleCreate = () => {
    // TODO: POST to /api/hewan-peliharaan
    router.push('/hewan-peliharaan');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Pet</h1>
          <Link href="/hewan-peliharaan" className="text-gray-500 hover:text-gray-700">Back</Link>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Pemilik</label>
            <input
              type="text"
              value={pemilik}
              onChange={e => setPemilik(e.target.value)}
              placeholder="Nama Pemilik"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Jenis Hewan</label>
            <input
              type="text"
              value={jenis}
              onChange={e => setJenis(e.target.value)}
              placeholder="Jenis Hewan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Hewan</label>
            <input
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Nama Hewan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://"
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
            onClick={handleCreate}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}