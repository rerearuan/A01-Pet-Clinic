'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DeletePet() {
  const { key } = useParams();
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPet = async () => {
      const res = await fetch(`/api/hewan-peliharaan/${key}`);
      if (res.ok) {
        const data = await res.json();
        setPetName(data.nama);
        setOwnerName(data.no_identitas_klien);
      }
    };
    if (key) fetchPet();
  }, [key]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/hewan-peliharaan/${key}`, { method: 'DELETE' });
      router.push('/hewan-peliharaan');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Delete Pet</h1>
        <p className="mb-6">
          Are you sure you want to delete <strong>{petName}</strong> owned by <strong>{ownerName}</strong>?
        </p>
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
