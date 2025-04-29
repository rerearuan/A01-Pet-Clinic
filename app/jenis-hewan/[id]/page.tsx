'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UpdateJenisHewan() {
  const { id } = useParams();
  const router = useRouter();
  const [nama, setNama] = useState('');

  useEffect(() => {
    // TODO: fetch(`/api/jenis-hewan/${id}`)
    //   .then(res => res.json())
    //   .then(data => setNama(data.nama_jenis));
  }, [id]);

  const handleUpdate = () => {
    // TODO: PUT to `/api/jenis-hewan/${id}` with { nama_jenis: nama }
    router.push('/jenis-hewan');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Update Animal Type</h2>
      <label className="block mb-2">ID Animal Type</label>
      <input
        type="text"
        value={id}
        disabled
        className="w-full border rounded-lg p-2 mb-4 bg-gray-100"
      />
      <label className="block mb-2">Type</label>
      <input
        type="text"
        value={nama}
        onChange={e => setNama(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />
      <button onClick={handleUpdate} className="px-4 py-2 bg-black text-white rounded-lg">
        Update
      </button>
      <button onClick={() => router.back()} className="ml-2 px-4 py-2 border rounded-lg">
        Cancel
      </button>
    </div>
  );
}