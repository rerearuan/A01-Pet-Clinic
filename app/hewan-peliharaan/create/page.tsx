'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePet() {
  const router = useRouter();
  const [pemilik, setPemilik] = useState('');
  const [jenis, setJenis] = useState('');
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // could fetch dropdown options here
  }, []);

  const handleCreate = () => {
    // dummy create, redirect back
    router.push('/hewan-peliharaan');
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Create New Pet</h2>
      <label>Pemilik</label>
      <input value={pemilik} onChange={e=>setPemilik(e.target.value)} className="w-full mb-2 p-2 border rounded" placeholder="Nama Pemilik" />
      <label>Jenis Hewan</label>
      <input value={jenis} onChange={e=>setJenis(e.target.value)} className="w-full mb-2 p-2 border rounded" placeholder="Jenis Hewan" />
      <label>Nama Hewan</label>
      <input value={nama} onChange={e=>setNama(e.target.value)} className="w-full mb-2 p-2 border rounded" placeholder="Nama Hewan" />
      <label>Tanggal Lahir</label>
      <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <label>URL Foto</label>
      <input value={url} onChange={e=>setUrl(e.target.value)} className="w-full mb-4 p-2 border rounded" placeholder="https://" />
      <div className="flex space-x-2">
        <button onClick={()=>router.back()} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleCreate} className="px-4 py-2 bg-black text-white rounded">Create</button>
      </div>
    </div>
  );
}