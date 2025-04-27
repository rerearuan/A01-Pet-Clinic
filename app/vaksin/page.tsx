'use client';

import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">List Vacctination</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            + Create New Vaccination
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-center">No</th>
                <th className="py-4 px-6 text-left">Kunjungan</th>
                <th className="py-4 px-6 text-left">Tanggal Kunjungan</th>
                <th className="py-4 px-6 text-left">Vaksin</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map((vaksin, index) => (
                <tr key={vaksin.id} className="border-t hover:bg-gray-50">
                  <td className="py-5 px-6 text-center">{index + 1}</td>
                  <td className="py-5 px-6">{vaksin.kunjungan}</td>
                  <td className="py-5 px-6">{vaksin.tanggalKunjungan}</td>
                  <td className="py-5 px-6">{vaksin.vaksin}</td>
                  <td className="py-5 px-6 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedVaccination(vaksin);
                        setShowUpdateModal(true);
                      }}
                      className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-xs font-semibold transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVaccination(vaksin);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-semibold transition"
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
        {showUpdateModal && selectedVaccination && <UpdateModal vaksin={selectedVaccination} onClose={() => setShowUpdateModal(false)} />}
        {showDeleteModal && selectedVaccination && <DeleteModal vaksin={selectedVaccination} onClose={() => setShowDeleteModal(false)} />}
      </div>
    </div>
  );
}

/* --- Create Modal Component --- */
function CreateModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper title="Create New Vaccination" onClose={onClose}>
      <DropdownField label="Kunjungan" options={kunjunganOptions} />
      <DropdownField label="Vaksin" options={vaksinOptions.map(v => `${v.kode} - ${v.nama} [${v.stok}]`)} />
      <ModalActions onClose={onClose} actionLabel="Create" actionColor="bg-black" />
    </ModalWrapper>
  );
}

/* --- Update Modal Component --- */
function UpdateModal({ vaksin, onClose }: { vaksin: Vaccination; onClose: () => void }) {
  return (
    <ModalWrapper title="Update Vaccination" onClose={onClose}>
      <DropdownField label="Kunjungan" options={kunjunganOptions} selected={vaksin.kunjungan} />
      <DropdownField label="Vaksin" options={vaksinOptions.map(v => `${v.kode} - ${v.nama} [${v.stok}]`)} selected={vaksin.vaksin} />
      <ModalActions onClose={onClose} actionLabel="Update" actionColor="bg-black" />
    </ModalWrapper>
  );
}

/* --- Delete Modal Component --- */
function DeleteModal({ vaksin, onClose }: { vaksin: Vaccination; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Delete Vaccination</h2>
        <p className="text-gray-700">
          Apakah kamu yakin ingin menghapus Vaksinasi untuk <b className="text-red-600">{vaksin.kunjungan}</b> dengan <b className="text-red-600">{vaksin.vaksin}</b>?
        </p>
        <div className="flex justify-center space-x-3 pt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">Cancel</button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
            Confirm Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Modal Wrapper (Reusable) --- */
function ModalWrapper({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* --- DropdownField (Reusable) --- */
function DropdownField({ label, options, selected }: { label: string, options: string[], selected?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-600">{label}</label>
      <select
        defaultValue={selected}
        className="w-full border p-2 rounded text-gray-900"
      >
        <option disabled value="">
          Pilih {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* --- Modal Actions (Reusable) --- */
function ModalActions({ onClose, actionLabel, actionColor }: { onClose: () => void, actionLabel: string, actionColor: string }) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button onClick={onClose} className="border px-4 py-2 rounded-lg">
        Cancel
      </button>
      <button className={`${actionColor} hover:opacity-90 text-white px-6 py-2 rounded-lg`}>
        {actionLabel}
      </button>
    </div>
  );
}
