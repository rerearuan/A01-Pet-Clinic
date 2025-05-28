'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';
import { useSession } from 'next-auth/react';

export default function ListJenis() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const [items, setItems] = useState<{ id: string; nama_jenis: string }[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && (role === 'front-desk' || role === 'dokter-hewan')) {
      const fetchItems = async () => {
        const res = await fetch('/api/jenis-hewan');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      };
      fetchItems();
    }
  }, [status, role]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (role !== 'front-desk' && role !== 'dokter-hewan') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Forbidden: You do not have access to this page.
      </div>
    );
  }

  const canEdit = role === 'front-desk';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">List Jenis Hewan</h1>
          {canEdit && (
            <Link href="/jenis-hewan/create">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-shadow shadow-md">
                <PlusIcon />
                <span>Create New Type</span>
              </button>
            </Link>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-100">
            <div className="py-3 text-center font-semibold">No</div>
            <div className="py-3 text-center font-semibold">ID</div>
            <div className="py-3 text-center font-semibold">Nama</div>
            {canEdit && (
            <div className="py-3 text-center font-semibold">Action</div>
            )}
          </div>
          {items.map((it, idx) => (
            <div key={it.id} className="grid grid-cols-4 items-center border-t border-gray-200 hover:bg-gray-50">
              <div className="py-3 text-center">{idx + 1}</div>
              <div className="py-3 text-center font-mono text-gray-700">{it.id}</div>
              <div className="py-3 text-center text-gray-800">{it.nama_jenis}</div>
              <div className="py-3 flex justify-center space-x-3">
                {canEdit && (
                  <>
                    <Link href={`/jenis-hewan/${it.id}/edit`}>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full">
                        <EditIcon />
                      </button>
                    </Link>
                    <Link href={`/jenis-hewan/${it.id}/delete`}>
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full">
                        <TrashIcon />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}