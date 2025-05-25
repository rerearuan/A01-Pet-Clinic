'use client';

import { useEffect, useState } from 'react';

type Vaccine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  used: boolean;
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function VaccineStockPage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | 'updateStock' | 'delete' | null>(null);

  const fetchVaccines = async () => {
    try {
      const res = await fetch('/api/vaccine-stok');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();

      const parsed: Vaccine[] = data.map((v: any) => ({
        id: v.kode,
        name: v.nama,
        price: v.harga,
        stock: v.stok,
        used: v.used,
      }));

      setVaccines(parsed);
    } catch (e) {
      console.error('Gagal ambil data vaksin:', e);
      setVaccines([]);
    }
  };


  useEffect(() => {
    fetchVaccines();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">List Vaccine</h1>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                setSelectedVaccine(null);
                setModalType('create');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-md"
            >
              <PlusIcon />
              <span>Create New Vaccine</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex">
            <input
              type="text"
              placeholder="Search Vaccine Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-l-lg p-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="bg-orange-500 text-white p-3 rounded-r-lg">
              <SearchIcon />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-50">
            <div className="py-4 text-center text-sm font-bold text-gray-800">No</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">ID Vaksin</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Nama Vaksin</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Harga</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Stok</div>
            <div className="py-4 text-center font-bold text-gray-800 w-48">Action</div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {vaccines
            .filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()))
            .map((vaccine, index) => (
              <div
                key={`${vaccine.id}-${index}`}
                className="grid grid-cols-6 items-center border-b last:border-b-0 border-gray-100 hover:bg-orange-50 transition-colors duration-200 ease-in-out"
              >
                <div className="py-4 text-sm text-gray-700 text-center">{index + 1}</div>
                <div className="py-4 text-sm text-gray-700 text-center">{vaccine.id}</div>
                <div className="py-4 text-sm text-gray-700 text-center">{vaccine.name}</div>
                <div className="py-4 text-sm text-gray-700 text-center">Rp{vaccine.price.toLocaleString('id-ID')}</div>
                <div className="py-4 text-sm text-gray-700 text-center">{vaccine.stock}</div>
                <div className="py-4 flex justify-center space-x-2 w-48">
                  <button
                    onClick={() => {
                      setSelectedVaccine(vaccine);
                      setModalType('updateStock');
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVaccine(vaccine);
                      setModalType('update');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                  >
                    Update
                  </button>
                  {!vaccine.used && (
                    <button
                      onClick={() => {
                        setSelectedVaccine(vaccine);
                        setModalType('delete');
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                    >
                      Delete
                    </button>

                  )}

                </div>
              </div>
            ))}
        </div>

        {/* Modals */}
        {modalType === 'create' && <CreateVaccineModal onClose={() => { setModalType(null); fetchVaccines(); }} />}
        {modalType === 'update' && selectedVaccine && <UpdateVaccineModal vaccine={selectedVaccine} onClose={() => { setModalType(null); fetchVaccines(); }} />}
        {modalType === 'updateStock' && selectedVaccine && <UpdateStockModal vaccine={selectedVaccine} onClose={() => { setModalType(null); fetchVaccines(); }} />}
        {modalType === 'delete' && selectedVaccine && <DeleteVaccineModal vaccine={selectedVaccine} onClose={() => { setModalType(null); fetchVaccines(); }} />}
      </main>
    </div>
  );
}

/* --- Modal Components --- */
function CreateVaccineModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || price === '' || stock === '') {
      setError('Semua field wajib diisi');
      return;
    }
    if (price < 0 || stock < 0) {
      setError('Harga dan stok tidak boleh negatif');
      return;
    }

    const res = await fetch('/api/vaccine-stok/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama: name, harga: price, stok: stock }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Gagal menambahkan vaksin');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Vaccine</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama Vaksin</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Harga</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Stok Awal</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90">Create</button>
        </div>
      </div>
    </div>
  );
}


function UpdateVaccineModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  const [name, setName] = useState(vaccine.name);
  const [price, setPrice] = useState(vaccine.price);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || price === null) {
      setError('Semua field wajib diisi');
      return;
    }
    if (price < 0) {
      setError('Harga tidak boleh negatif');
      return;
    }

    const res = await fetch('/api/vaccine-stok/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode: vaccine.id, nama: name, harga: price }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Gagal update vaksin');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Vaccine</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">ID Vaksin</label>
            <input value={vaccine.id} disabled className="w-full bg-gray-200 border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Nama Vaksin</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Harga</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90">Update</button>
        </div>
      </div>
    </div>
  );
}


function UpdateStockModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  const [stock, setStock] = useState(vaccine.stock);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (stock === null || stock < 0) {
      setError('Stok tidak valid');
      return;
    }

    const res = await fetch('/api/vaccine-stok/update-stock', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode: vaccine.id, stok: stock }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || 'Gagal update stok');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Vaccine Stock</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p className="text-gray-600">{vaccine.id} - {vaccine.name}</p>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Stok</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90">Update Stock</button>
        </div>
      </div>
    </div>
  );
}


function DeleteVaccineModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/vaccine-stok/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kode: vaccine.id }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Gagal menghapus vaksin');
        return;
      }

      onClose();
    } catch (err: any) {
      setError('Gagal menghapus vaksin: ' + err.message);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-orange-500 text-center">Delete Vaccine</h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div className="text-center text-black">
          <p className="font-medium">Apakah kamu yakin ingin menghapus vaksin</p>
          <p className="font-bold">{vaccine.name} dengan ID <span className="text-orange-500">{vaccine.id}</span>?</p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 px-6 py-2 rounded-lg">Cancel</button>
          <button onClick={handleDelete} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  );
}
