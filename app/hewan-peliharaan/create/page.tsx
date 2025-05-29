'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import { useSession } from 'next-auth/react';

export default function CreatePet() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const [pemilik, setPemilik] = useState('');
  const [jenis, setJenis] = useState('');
  const [nama, setNama] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [url, setUrl] = useState('');
  const [owners, setOwners] = useState<{ id: string; label: string }[]>([]);
  const [jenisList, setJenisList] = useState<{ id: string; label: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchOptions = async () => {
        try {
          const [resKlien, resJenis] = await Promise.all([
            fetch('/api/client'),
            fetch('/api/jenis-hewan'),
          ]);

          if (resKlien.ok) {
            const klienData = await resKlien.json();
            setOwners(klienData.map((k: any) => ({
              id: k.no_identitas,
              label: `${k.nama} (${k.no_identitas.slice(0, 8)}...)`
            })));
          }

          if (resJenis.ok) {
            const jenisData = await resJenis.json();
            setJenisList(jenisData.map((j: any) => ({
              id: j.id,
              label: j.nama_jenis
            })));
          }
        } catch (err) {
          console.error('Error fetching dropdown options:', err);
        }
      };

      fetchOptions();
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (role !== 'front-desk' && role !== 'individu' && role !== 'perusahaan') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Forbidden: You do not have access to create a pet.
      </div>
    );
  }

  const handleCreate = async () => {
    try {
      const body = {
        nama,
        no_identitas_klien: pemilik,
        id_jenis: jenis,
        tanggal_lahir: tanggal,
        url_foto: url,
      };

      const res = await fetch('/api/hewan-peliharaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to create pet');

      router.push('/hewan-peliharaan');
    } catch (err) {
      console.error('Create pet error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Pet</h1>
          <Link href="/hewan-peliharaan" className="text-gray-500 hover:text-gray-700">Back</Link>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Pemilik</label>
            <Select
              value={owners.find(o => o.id === pemilik) || null}
              onChange={(option) => setPemilik(option?.id || '')}
              options={owners}
              getOptionLabel={(o) => o.label}
              getOptionValue={(o) => o.id}
              placeholder="Pilih Pemilik"
              isSearchable
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Jenis Hewan</label>
            <Select
              value={jenisList.find(j => j.id === jenis) || null}
              onChange={(option) => setJenis(option?.id || '')}
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
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Nama Hewan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Lahir</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://"
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
            onClick={handleCreate}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}