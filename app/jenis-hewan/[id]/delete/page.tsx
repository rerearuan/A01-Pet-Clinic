'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DeleteJenisHewan() {
  const { id } = useParams();
  const router = useRouter();
  const [nama, setNama] = useState('');

  useEffect(() => {
    // TODO: fetch(`/api/jenis-hewan/${id}`)
    //   .then(res => res.json())
    //   .then(data => setNama(data.nama_jenis));
  }, [id]);

  const handleDelete = () => {
    // TODO: DELETE to `/api/jenis-hewan/${id}`
    router.push('/jenis-hewan');
  };

  return (
    <div className="p-6">
      <h2 className="text-red-600 text-xl font-bold mb-4">Delete Animal Type</h2>
      <p>Are you sure you want to delete type <strong>{nama}</strong> (<code>{id}</code>)?</p>
      <button onClick={handleDelete} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
        Confirm Deletion
      </button>
      <button onClick={() => router.back()} className="mt-4 ml-2 px-4 py-2 border rounded-lg">
        Cancel
      </button>
    </div>
  );
}