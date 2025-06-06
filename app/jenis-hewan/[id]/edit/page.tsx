'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UpdateJenis() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const { id } = useParams();
  const [nama, setNama] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (role === 'front-desk' && id) {
      const fetchJenis = async () => {
        const res = await fetch(`/api/jenis-hewan/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNama(data.nama_jenis);
        }
      };
      fetchJenis();
    }
  }, [id, role]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (role !== 'front-desk') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Forbidden: You do not have access to edit this type.
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      await fetch(`/api/jenis-hewan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      router.push('/jenis-hewan');
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Update Jenis Hewan</h1>
          <Link href="/jenis-hewan" className="text-gray-500 hover:text-gray-700">Back</Link>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">ID Jenis</label>
            <input
              type="text"
              value={id}
              disabled
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Jenis Hewan</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama jenis"
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
