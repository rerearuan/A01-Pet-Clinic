'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function UpdatePet() {
  const { key } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    // dummy fetch by key
    const dummy = {
      key,
      pemilik: 'John Doe',
      jenis: 'Kucing',
      nama: 'Snowy',
      tanggal_lahir: '2020-02-09',
      url_foto: 'https://example.com/snowy.jpg',
    };
    setPet(dummy);
  }, [key]);

  if (!pet) return <div>Loading...</div>;

  const handleUpdate = () => router.push('/hewan-peliharaan');

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Update Pet</h2>
      <label>Pemilik</label>
      <input value={pet.pemilik} disabled className="w-full mb-2 p-2 border rounded bg-gray-100" />
      <label>Jenis Hewan</label>
      <input value={pet.jenis} onChange={()=>{}} className="w-full mb-2 p-2 border rounded" />
      <label>Nama Hewan</label>
      <input value={pet.nama} onChange={()=>{}} className="w-full mb-2 p-2 border rounded" />
      <label>Tanggal Lahir</label>
      <input type="date" value={pet.tanggal_lahir} onChange={()=>{}} className="w-full mb-2 p-2 border rounded" />
      <label>URL Foto</label>
      <input value={pet.url_foto} onChange={()=>{}} className="w-full mb-4 p-2 border rounded" />
      <div className="flex space-x-2">
        <button onClick={()=>router.back()} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleUpdate} className="px-4 py-2 bg-black text-white rounded">Update</button>
      </div>
    </div>
  );
}