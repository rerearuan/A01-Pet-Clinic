'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DeleteJenis() {
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
        Forbidden: You do not have access to delete this type.
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await fetch(`/api/jenis-hewan/${id}`, { method: 'DELETE' });
      router.push('/jenis-hewan');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-orange-500 mb-4">Delete Jenis Hewan</h1>
        <p className="mb-6">Are you sure you want to delete <strong>{nama}</strong> (ID: <code>{id}</code>)?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}