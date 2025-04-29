'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function CreateJenisHewan() {
  const [nama, setNama] = useState('');
  const router = useRouter();

  const handleCreate = () => {
    const newItem = { id: uuidv4(), nama_jenis: nama };
    // TODO: POST to /api/jenis-hewan
    router.push('/jenis-hewan');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create New Animal Type</h2>
      <input
        type="text"
        placeholder="Nama Jenis"
        value={nama}
        onChange={e => setNama(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />
      <button onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded-lg">
        Create
      </button>
    </div>
  );
}