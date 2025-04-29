'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JenisHewan { id: string; nama_jenis: string; }

export default function ListJenisHewan() {
  const [data, setData] = useState<JenisHewan[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Dummy data for Jenis Hewan
    setData([
      { id: 'HWN001', nama_jenis: 'Kucing' },
      { id: 'HWN002', nama_jenis: 'Anjing' },
      { id: 'HWN003', nama_jenis: 'Hamster' },
      { id: 'HWN004', nama_jenis: 'Burung' },
      { id: 'HWN005', nama_jenis: 'Ikan' },
    ]);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">List Animal Type</h1>
      <button
        onClick={() => router.push('/jenis-hewan/create')}
        className="mb-4 px-4 py-2 bg-black text-white rounded-lg"
      >
        + Create New Animal Type
      </button>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">ID Type</th>
            <th className="px-4 py-2">Nama Jenis</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id} className="border-t">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{row.id}</td>
              <td className="px-4 py-2">{row.nama_jenis}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => router.push(`/jenis-hewan/${row.id}`)}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => router.push(`/jenis-hewan/${row.id}/delete`)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}