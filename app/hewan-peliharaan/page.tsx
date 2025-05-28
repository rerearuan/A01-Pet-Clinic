'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';
import { useSession } from 'next-auth/react';

type Pet = { key: string; pemilik: string; jenis: string; nama: string; tanggal_lahir: string; url_foto: string };

export default function ListPets() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchPets = async () => {
        const res = await fetch('/api/hewan-peliharaan');
        if (res.ok) {
          const data = await res.json();
          setPets(data.map((p: any) => ({
            key: `${p.nama}_${p.no_identitas_klien}`,
            pemilik: p.no_identitas_klien,
            jenis: p.nama_jenis,
            nama: p.nama,
            tanggal_lahir: p.tanggal_lahir,
            url_foto: p.url_foto,
          })));
        }
      };
      fetchPets();
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (role !== 'front-desk' && role !== 'individu' && role !== 'perusahaan') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Forbidden: You do not have access to view this page.
      </div>
    );
  }

  const canEdit = role === 'front-desk' || role === 'individu' || role === 'perusahaan';
  const canDelete = role === 'front-desk';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">List Hewan Peliharaan</h1>
          {canEdit && (
            <Link href="/hewan-peliharaan/create">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-shadow shadow-md">
                <PlusIcon />
                <span>Create New Pet</span>
              </button>
            </Link>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-100">
            <div className="py-3 text-center font-semibold">No</div>
            <div className="py-3 text-center font-semibold">Pemilik</div>
            <div className="py-3 text-center font-semibold">Jenis</div>
            <div className="py-3 text-center font-semibold">Nama</div>
            <div className="py-3 text-center font-semibold">Lahir</div>
            <div className="py-3 text-center font-semibold">Foto</div>
            <div className="py-3 text-center font-semibold">Action</div>
          </div>
          {pets.map((pet, idx) => (
            <div key={pet.key} className="grid grid-cols-7 items-center border-t border-gray-200 hover:bg-gray-50">
              <div className="py-3 text-center">{idx + 1}</div>
              <div className="py-3 text-center text-gray-800">{pet.pemilik}</div>
              <div className="py-3 text-center text-gray-800">{pet.jenis}</div>
              <div className="py-3 text-center text-gray-800">{pet.nama}</div>
              <div className="py-3 text-center text-gray-800">{pet.tanggal_lahir}</div>
              <div className="py-3 text-center">
                <img src={pet.url_foto} alt={pet.nama} className="h-12 w-12 object-cover rounded-full mx-auto" />
              </div>
              <div className="py-3 flex justify-center space-x-3">
                {canEdit && (
                  <Link href={`/hewan-peliharaan/${pet.key}/edit`}>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full">
                      <EditIcon />
                    </button>
                  </Link>
                )}
                {canDelete && (
                  <Link href={`/hewan-peliharaan/${pet.key}/delete`}>
                    <button className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full">
                      <TrashIcon />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}