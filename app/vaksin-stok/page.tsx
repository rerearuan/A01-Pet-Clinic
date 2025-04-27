'use client';

import { useState } from 'react';

type Vaccine = {
  id: string;
  name: string;
  price: number;
  stock: number;
  used: boolean;
};

const dummyVaccines: Vaccine[] = [
  { id: 'VAC001', name: 'Feline Panleukopenia', price: 75000, stock: 30, used: true },
  { id: 'VAC002', name: 'Canine Parvovirus', price: 90000, stock: 25, used: false },
  { id: 'VAC003', name: 'Canine Adenovirus', price: 85000, stock: 40, used: false },
];

export default function VaccineStockPage() {
  const [vaccines, setVaccines] = useState(dummyVaccines);
  const [search, setSearch] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [modalType, setModalType] = useState<'create' | 'update' | 'updateStock' | 'delete' | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">List Vaccine</h1>
          <button
            onClick={() => {
              setSelectedVaccine(null);
              setModalType('create');
            }}
            className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            + Add New Vaccine
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex">
          <input
            type="text"
            placeholder="Search Vaccine Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-l-lg p-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button className="bg-black text-white px-4 rounded-r-lg">
            🔍
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide text-xs">
              <tr>
                <th className="py-4 px-6 text-center">No</th>
                <th className="py-4 px-6">ID Vaksin</th>
                <th className="py-4 px-6">Nama Vaksin</th>
                <th className="py-4 px-6">Harga</th>
                <th className="py-4 px-6">Stok</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {vaccines
                .filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()))
                .map((vaccine, index) => (
                  <tr key={vaccine.id} className="border-t hover:bg-gray-50">
                    <td className="py-5 px-6 text-center">{index + 1}</td>
                    <td className="py-5 px-6">{vaccine.id}</td>
                    <td className="py-5 px-6">{vaccine.name}</td>
                    <td className="py-5 px-6">Rp{vaccine.price.toLocaleString('id-ID')}</td>
                    <td className="py-5 px-6">{vaccine.stock}</td>
                    <td className="py-5 px-6 flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVaccine(vaccine);
                          setModalType('updateStock');
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-xs font-semibold"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVaccine(vaccine);
                          setModalType('update');
                        }}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                      >
                        Update
                      </button>
                      {!vaccine.used && (
                        <button
                          onClick={() => {
                            setSelectedVaccine(vaccine);
                            setModalType('delete');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {modalType && (
        <Modal
          type={modalType}
          vaccine={selectedVaccine}
          onClose={() => {
            setSelectedVaccine(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}

/* --- Modal Component --- */
function Modal({
  type,
  vaccine,
  onClose,
}: {
  type: 'create' | 'update' | 'updateStock' | 'delete';
  vaccine: Vaccine | null;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 space-y-6">
        {type === 'create' && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Create New Vaccine</h2>
            <div className="space-y-2">
              <input placeholder="Nama" className="w-full border p-3 rounded-lg text-gray-800" />
              <input placeholder="Harga" type="number" className="w-full border p-3 rounded-lg text-gray-800" />
              <input placeholder="Stok Awal" type="number" className="w-full border p-3 rounded-lg text-gray-800" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={onClose} className="border px-4 py-2 rounded-lg text-gray-800">
                Cancel
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
                Create
              </button>
            </div>
          </>
        )}

        {type === 'update' && vaccine && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Update Vaccine</h2>
            <div className="space-y-2">
              <input value={vaccine.id} disabled className="w-full border p-3 rounded-lg bg-gray-100 text-gray-800" />
              <input placeholder="Nama Vaksin" className="w-full border p-3 rounded-lg text-gray-800" />
              <input placeholder="Harga" type="number" className="w-full border p-3 rounded-lg text-gray-800" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={onClose} className="border px-4 py-2 rounded-lg text-gray-800">
                Cancel
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
                Update
              </button>
            </div>
          </>
        )}

        {type === 'updateStock' && vaccine && (
          <>
            <h2 className="text-2xl font-bold text-gray-800">Update Vaccine Stock</h2>
            <p className="text-gray-600">{vaccine.id} - {vaccine.name}</p>
            <div className="space-y-2 pt-2">
              <input placeholder="Stok" type="number" className="w-full border p-3 rounded-lg text-gray-800" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={onClose} className="border px-4 py-2 rounded-lg text-gray-800">
                Cancel
              </button>
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg">
                Update Stock
              </button>
            </div>
          </>
        )}

        {type === 'delete' && vaccine && (
        <>
            <h2 className="text-2xl font-bold text-red-600">Delete Vaccine</h2>
            <p className="text-gray-700">
            Apakah kamu yakin ingin menghapus Vaksin{' '}
            <b className="text-red-600">{vaccine.name}</b> dengan{' '}
            <b className="text-red-600">{vaccine.id}</b>?
            </p>
            <div className="flex justify-center space-x-3 pt-6">
            <button onClick={onClose} className="border px-4 py-2 rounded-lg text-gray-800">
                Cancel
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                Confirm Deletion
            </button>
            </div>
        </>
        )}
      </div>
    </div>
  );
}
