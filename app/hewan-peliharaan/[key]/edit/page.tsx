'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import { useSession } from 'next-auth/react';

export default function UpdatePet() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const { key } = useParams();
  const [owners, setOwners] = useState<{ id: string; label: string }[]>([]);
  const [jenisList, setJenisList] = useState<{ id: string; label: string }[]>([]);
  const [pet, setPet] = useState<{
    pemilik: string;
    jenis: string;
    nama: string;
    tanggal_lahir: string;
    url_foto: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && key) {
      const fetchData = async () => {
        try {
          const [resPet, resJenis, resKlien] = await Promise.all([
            fetch(`/api/hewan-peliharaan/${key}`),
            fetch('/api/jenis-hewan'),
            fetch('/api/client'),
          ]);

          if (resJenis.ok) {
            const jenisData = await resJenis.json();
            setJenisList(jenisData.map((j: any) => ({
              id: j.id,
              label: j.nama_jenis
            })));
          }

          if (resKlien.ok) {
            const klienData = await resKlien.json();
            setOwners(klienData.map((k: any) => ({
              id: k.no_identitas,
              label: `${k.nama} (${k.no_identitas.slice(0, 8)}...)`
            })));
          }

          if (resPet.ok) {
            const data = await resPet.json();
            setPet({
              pemilik: data.no_identitas_klien,
              jenis: data.id_jenis,
              nama: data.nama,
              tanggal_lahir: data.tanggal_lahir,
              url_foto: data.url_foto,
            });
          }
        } catch (err) {
          console.error('Fetch error:', err);
        }
      };
      fetchData();
    }
  }, [status, key]);

  if (status === 'loading' || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (role !== 'front-desk' && role !== 'individu' && role !== 'perusahaan') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Forbidden: You do not have access to edit this pet.
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      await fetch(`/api/hewan-peliharaan/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pet),
      });
      router.push('/hewan-peliharaan');
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Pet</h1>
          <Link href="/hewan-peliharaan" className="text-gray-500 hover:text-gray-700">
            Back
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Pemilik</label>
            <input
              type="text"
              value={owners.find(o => o.id === pet.pemilik)?.label || pet.pemilik}
              disabled
              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Jenis Hewan</label>
            <Select
              value={jenisList.find(j => j.id === pet.jenis) || null}
              onChange={(option) => setPet({ ...pet, jenis: option?.id || '' })}
              options={jenisList}
              getOptionLabel={(j) => j.label}
              getOptionValue={(j) => j.id}
              placeholder="Pilih Jenis Hewan"
              isSearchable
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Hewan</label>
            <input
              type="text"
              value={pet.nama}
              onChange={e => setPet({ ...pet, nama: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={pet.tanggal_lahir}
              onChange={e => setPet({ ...pet, tanggal_lahir: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto</label>
            <input
              type="text"
              value={pet.url_foto}
              onChange={e => setPet({ ...pet, url_foto: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
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