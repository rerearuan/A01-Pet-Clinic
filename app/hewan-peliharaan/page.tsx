'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Pet { key: string; pemilik: string; jenis: string; nama: string; tanggal_lahir: string; url_foto: string; }
export default function ListPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPets([
      { key: 'PET001', pemilik: 'John Doe', jenis: 'Kucing', nama: 'Snowy', tanggal_lahir: '2020-02-09', url_foto: 'https://example.com/snowy.jpg' },
      { key: 'PET002', pemilik: 'PT Pecinta Kucing', jenis: 'Anjing', nama: 'Blacky', tanggal_lahir: '2019-11-15', url_foto: 'https://example.com/blacky.jpg' },
      { key: 'PET003', pemilik: 'PT Aku Sayang Hewan', jenis: 'Hamster', nama: 'Hamseoung', tanggal_lahir: '2024-10-15', url_foto: 'https://example.com/hamseoung.jpg' },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">List Hewan Peliharaan</h1>
      <button onClick={() => router.push('/hewan-peliharaan/create')} className="mb-4 px-4 py-2 bg-black text-white rounded-lg">
        + Create New Pet
      </button>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>No</th><th>Pemilik</th><th>Jenis Hewan</th><th>Nama Hewan</th><th>Tanggal Lahir</th><th>Foto</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((p, i) => (
            <tr key={p.key} className="border-t">
              <td className="px-4 py-2">{i+1}</td>
              <td className="px-4 py-2">{p.pemilik}</td>
              <td className="px-4 py-2">{p.jenis}</td>
              <td className="px-4 py-2">{p.nama}</td>
              <td className="px-4 py-2">{p.tanggal_lahir}</td>
              <td className="px-4 py-2"><img src={p.url_foto} alt={p.nama} className="h-12 w-12 object-cover rounded"/></td>
              <td className="px-4 py-2 space-x-2">
                <button onClick={() => router.push(`/hewan-peliharaan/${p.key}`)} className="px-2 py-1 bg-blue-600 text-white rounded">Update</button>
                <button onClick={() => router.push(`/hewan-peliharaan/${p.key}/delete`)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}