"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaSpinner, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RekamMedis } from '../page';

type RekamMedisModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: RekamMedis) => Promise<void>; // Make optional and async
  existingData?: RekamMedis | null;
  isLoading?: boolean;
  id: string;
  clientId: string;
  petName: string;
  frontDeskId: string;
  nurseId: string;
  doctorId: string;
};

export default function RekamMedisModal({
  isOpen,
  onClose,
  onSubmit,
  existingData = null,
  isLoading = false,
  id,
  clientId,
  petName,
  frontDeskId,
  nurseId,
  doctorId,
}: RekamMedisModalProps) {
  const [formData, setFormData] = useState<RekamMedis>(
    existingData || {
      bodyTemperature: 0,
      bodyWeight: 0,
      catatan: '',
    }
  );
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when existingData changes
  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    }
  }, [existingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    

    try {
      // Validate form data
      if (isNaN(Number(formData.bodyTemperature))){
        throw new Error('Suhu tubuh harus berupa angka');
      }
      if (isNaN(Number(formData.bodyWeight))) {
        throw new Error('Berat badan harus berupa angka');
      }

      
      // Prepare complete data for API
      const completeData = {
        ...formData,
        nama_hewan: petName,
        no_identitas_klien: clientId,
        no_front_desk: frontDeskId,
        no_perawat_hewan: nurseId,
        no_dokter_hewan: doctorId
      };

      // If onSubmit prop is provided, use it
      if (onSubmit) {
         console.log("bisaa")
        await onSubmit(formData);
      }
      await updateRekamMedis(id, completeData);

      toast.success('Rekam medis berhasil diperbarui');
      onClose();
    } catch (error) {
      console.error('Error updating medical record:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
      toast.error('Gagal memperbarui rekam medis');
    } finally {
      setIsSubmitting(false);
    }
  };

  // API call function
  const updateRekamMedis = async (id: string, data: any) => {
    const response = await fetch(`/api/visits/rekam_medis/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal memperbarui rekam medis');
    }

    return response.json();
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError(null);
    if (existingData) {
      setIsEditing(false);
      setFormData(existingData);
    } else {
      setShowForm(false);
    }
  };

  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-2xl text-blue-500" />
            <span className="ml-2">Memuat data rekam medis...</span>
          </div>
        </div>
      </div>
    );
  }

  // Edit or Create mode
  if ((existingData && isEditing) || (!existingData && showForm)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {existingData ? 'Edit Rekam Medis' : 'Buat Rekam Medis'}
            </h2>
            <button 
              onClick={handleCancel} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="bodyTemperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Suhu Tubuh (°C)
                </label>
                <input
                  id="bodyTemperature"
                  type="number"
                  step="0.1"
                  name="bodyTemperature"
                  value={formData.bodyTemperature}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  min="30"
                  max="45"
                  aria-label="Body temperature"
                />
              </div>
              
              <div>
                <label htmlFor="bodyWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Berat Badan (kg)
                </label>
                <input
                  id="bodyWeight"
                  type="number"
                  step="0.1"
                  name="bodyWeight"
                  value={formData.bodyWeight}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  min="0.1"
                  aria-label="Body weight"
                />
              </div>
              
              <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  aria-label="Medical notes"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  aria-label="Cancel"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
                  aria-label="Save medical record"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View mode (existing data)
  if (existingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rekam Medis</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Suhu Tubuh</p>
                <p className="font-medium">{existingData.bodyTemperature}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Berat Badan</p>
                <p className="font-medium">{existingData.bodyWeight} kg</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Catatan</p>
              <p className="font-medium whitespace-pre-line">{existingData.catatan}</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                Tutup
              </button>
              {userRole==='dokter-hewan' && <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                aria-label="Edit medical record"
              >
                <FaEdit /> Edit
              </button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data available (create new)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rekam Medis Tidak Tersedia</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">Maaf, sepertinya belum ada rekam medis yang dibuat untuk kunjungan ini.</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              OK
            </button>
            {userRole === 'dokter-hewan' && <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              aria-label="Create medical record"
            >
              Buat Rekam Medis
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
}