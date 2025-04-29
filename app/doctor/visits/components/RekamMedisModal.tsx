"use client";

import { useState } from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa';

type RekamMedis = {
  suhuTubuh: string;
  beratBadan: string;
  jenisPerawatan: string;
  catatan: string;
  waktuPerawatan: string;
};

type RekamMedisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RekamMedis) => void;
  existingData?: RekamMedis | null;
};

export default function RekamMedisModal({
  isOpen,
  onClose,
  onSubmit,
  existingData = null,
}: RekamMedisModalProps) {
  const [formData, setFormData] = useState<RekamMedis>(
    existingData || {
      suhuTubuh: '',
      beratBadan: '',
      jenisPerawatan: '',
      catatan: '',
      waktuPerawatan: new Date().toISOString().slice(0, 16),
    }
  );
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsEditing(false);
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingData) {
      setIsEditing(false);
      setFormData(existingData);
    } else {
      setShowForm(false);
    }
  };

  if (!isOpen) return null;

  // Jika sedang edit mode atau create new
  if ((existingData && isEditing) || (!existingData && showForm)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {existingData ? 'Edit Rekam Medis' : 'Buat Rekam Medis'}
            </h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suhu Tubuh (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="suhuTubuh"
                  value={formData.suhuTubuh}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="beratBadan"
                  value={formData.beratBadan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Perawatan</label>
                <select
                  name="jenisPerawatan"
                  value={formData.jenisPerawatan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Pilih Jenis Perawatan</option>
                  <option value="Vaksinasi">Vaksinasi</option>
                  <option value="Sterilisasi">Sterilisasi</option>
                  <option value="Pemeriksaan Rutin">Pemeriksaan Rutin</option>
                  <option value="Pengobatan">Pengobatan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Perawatan</label>
                <input
                  type="datetime-local"
                  name="waktuPerawatan"
                  value={formData.waktuPerawatan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Jika sudah ada data, tampilkan view mode dengan tombol edit
  if (existingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rekam Medis</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Suhu Tubuh</p>
                <p className="font-medium">{existingData.suhuTubuh}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Berat Badan</p>
                <p className="font-medium">{existingData.beratBadan} kg</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Jenis Perawatan</p>
              <p className="font-medium">{existingData.jenisPerawatan}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Waktu Perawatan</p>
              <p className="font-medium">
                {new Date(existingData.waktuPerawatan).toLocaleString('id-ID')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Catatan</p>
              <p className="font-medium whitespace-pre-line">{existingData.catatan}</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jika belum ada data, tampilkan pesan dengan tombol create
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rekam Medis Tidak Tersedia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">Maaf, sepertinya belum ada rekam medis yang dibuat untuk kunjungan ini.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              OK
            </button>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}