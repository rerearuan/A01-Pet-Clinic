'use client';

import { useState } from 'react';
import Link from 'next/link';

type Vaccination = {
  id: number;
  kunjungan: string;
  tanggalKunjungan: string;
  vaksin: string;
};

const kunjunganOptions = ['KJN001', 'KJN002', 'KJN003'];
const vaksinOptions = [
  { kode: 'VAC001', nama: 'Feline Panleukopenia', stok: 30 },
  { kode: 'VAC002', nama: 'Canine Parvovirus', stok: 25 },
  { kode: 'VAC003', nama: 'Canine Adenovirus', stok: 40 },
];

const dummyVaccinations: Vaccination[] = [
  { id: 1, kunjungan: 'KJN001', tanggalKunjungan: 'Rabu, 5 Februari 2025', vaksin: 'VAC001 - Feline Panleukopenia' },
  { id: 2, kunjungan: 'KJN002', tanggalKunjungan: 'Jumat, 21 Februari 2025', vaksin: 'VAC002 - Canine Parvovirus' },
  { id: 3, kunjungan: 'KJN003', tanggalKunjungan: 'Selasa, 15 Maret 2025', vaksin: 'VAC003 - Canine Adenovirus' },
];

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState(dummyVaccinations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">List Perawatan</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg transition"
          >
            + Create New Treatment
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-4 px-6 text-center">NO</th>
                <th className="py-4 px-6 text-left">KUNJUNGAN</th>
                <th className="py-4 px-6 text-left">TANGGAL KUNJUNGAN</th>
                <th className="py-4 px-6 text-left">VAKSIN</th>
                <th className="py-4 px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map((vaksin, index) => (
                <tr key={vaksin.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6 text-center">{index + 1}</td>
                  <td className="py-4 px-6">{vaksin.kunjungan}</td>
                  <td className="py-4 px-6">{vaksin.tanggalKunjungan}</td>
                  <td className="py-4 px-6">{vaksin.vaksin}</td>
                  <td className="py-4 px-6 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedVaccination(vaksin);
                        setShowUpdateModal(true);
                      }}
                      className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-xs rounded-lg transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVaccination(vaksin);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-xs rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} />}
        {showUpdateModal && selectedVaccination && (
          <UpdateModal vaksin={selectedVaccination} onClose={() => setShowUpdateModal(false)} />
        )}
        {showDeleteModal && selectedVaccination && (
          <DeleteModal vaksin={selectedVaccination} onClose={() => setShowDeleteModal(false)} />
        )}
      </div>
    </div>
  );
}

/* --- Create Modal --- */
function CreateModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper title="Create New Treatment" onClose={onClose}>
      <DropdownField label="Kunjungan" options={kunjunganOptions} />
      <DropdownField label="Vaksin" options={vaksinOptions.map(v => `${v.kode} - ${v.nama} [Stok ${v.stok}]`)} />
      <ModalActions onClose={onClose} actionLabel="Create" actionColor="bg-orange-500" />
    </ModalWrapper>
  );
}

/* --- Update Modal --- */
function UpdateModal({ vaksin, onClose }: { vaksin: Vaccination; onClose: () => void }) {
  return (
    <ModalWrapper title="Update Treatment" onClose={onClose}>
      <DropdownField label="Kunjungan" options={kunjunganOptions} selected={vaksin.kunjungan} />
      <DropdownField label="Vaksin" options={vaksinOptions.map(v => `${v.kode} - ${v.nama} [Stok ${v.stok}]`)} selected={vaksin.vaksin} />
      <ModalActions onClose={onClose} actionLabel="Update" actionColor="bg-black" />
    </ModalWrapper>
  );
}

/* --- Delete Modal --- */
function DeleteModal({ vaksin, onClose }: { vaksin: Vaccination; onClose: () => void }) {
  return (
    <ModalWrapper title="Delete Treatment" onClose={onClose}>
      <p className="text-center text-gray-600 mb-6">
        Yakin mau hapus vaksin <b>{vaksin.vaksin}</b> dari kunjungan <b>{vaksin.kunjungan}</b>?
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">
          Cancel
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
          Delete
        </button>
      </div>
    </ModalWrapper>
  );
}

/* --- Modal Wrapper --- */
function ModalWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* --- Dropdown Field --- */
function DropdownField({ label, options, selected }: { label: string; options: string[]; selected?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-600 font-semibold">{label}</label>
      <select
        defaultValue={selected || ''}
        className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
      >
        <option disabled value="">Pilih {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* --- Modal Actions --- */
function ModalActions({ onClose, actionLabel, actionColor }: { onClose: () => void; actionLabel: string; actionColor: string }) {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <button onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg">
        Cancel
      </button>
      <button className={`${actionColor} hover:opacity-90 text-white px-6 py-2 rounded-lg`}>
        {actionLabel}
      </button>
    </div>
  );
}
