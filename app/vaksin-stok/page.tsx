'use client';

import { useState } from 'react';

// Custom icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Search Bar */}
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

        {/* Table Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {vaccines
            .filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()))
            .map((vaccine, index) => (
              <div
                key={vaccine.id}
                className="grid grid-cols-6 items-center border-b last:border-b-0 border-gray-100 hover:bg-gray-50"
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
      </main>

      {/* Modals */}
      {modalType === 'create' && (
        <CreateVaccineModal onClose={() => setModalType(null)} />
      )}
      {modalType === 'update' && selectedVaccine && (
        <UpdateVaccineModal vaccine={selectedVaccine} onClose={() => setModalType(null)} />
      )}
      {modalType === 'updateStock' && selectedVaccine && (
        <UpdateStockModal vaccine={selectedVaccine} onClose={() => setModalType(null)} />
      )}
      {modalType === 'delete' && selectedVaccine && (
        <DeleteVaccineModal vaccine={selectedVaccine} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}

/* --- Modal Components --- */
function CreateVaccineModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Vaccine</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Vaksin</label>
            <input type="text" placeholder="Masukkan nama vaksin" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Harga</label>
            <input type="number" placeholder="Masukkan harga" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stok Awal</label>
            <input type="number" placeholder="Masukkan stok awal" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function UpdateVaccineModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Vaccine</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">ID Vaksin</label>
            <input 
              type="text" 
              value={vaccine.id} 
              disabled 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Vaksin</label>
            <input 
              type="text" 
              defaultValue={vaccine.name}
              placeholder="Masukkan nama vaksin" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Harga</label>
            <input 
              type="number" 
              defaultValue={vaccine.price}
              placeholder="Masukkan harga" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function UpdateStockModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Vaccine Stock</h2>
        <p className="text-gray-600">{vaccine.id} - {vaccine.name}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stok</label>
            <input 
              type="number" 
              defaultValue={vaccine.stock}
              placeholder="Masukkan stok" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteVaccineModal({ vaccine, onClose }: { vaccine: Vaccine; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-orange-500 text-center">Delete Vaccine</h2>
          
          <div className="text-center space-y-1">
            <p className="text-black font-medium">Apakah kamu yakin ingin menghapus Vaksin</p>
            <p className="text-black font-bold">
              <span className="text-orange-500">{vaccine.name}</span> dengan ID <span className="text-orange-500">{vaccine.id}</span> ?
            </p>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-white border border-gray-300 text-gray-700 font-semibold px-8 py-2 rounded-lg hover:bg-gray-100 transition min-w-32"
            >
              Cancel
            </button>
            <button
              className="bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:opacity-90 transition min-w-32"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}