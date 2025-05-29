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
  onSubmit?: (data: RekamMedis) => void;
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
      bodyTemperature: null, // Change to null for initial empty state
      bodyWeight: null,      // Change to null for initial empty state
      catatan: '',
    }
  );
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ bodyTemperature?: string; bodyWeight?: string; catatan?: string; general?: string }>({});

  useEffect(() => {
    if (existingData && (existingData.bodyTemperature !== null || existingData.bodyWeight !== null || existingData.catatan !== null)) {
      setFormData(existingData);
    } else {
      setFormData({ bodyTemperature: null, bodyWeight: null, catatan: '' });
    }
  }, [existingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Clear the specific error when the user starts typing in that field
    setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));

    if (name === "bodyTemperature") {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : parseInt(value) }));
    } else if (name === "bodyWeight") {
      setFormData(prev => ({ ...prev, [name]: value === '' ? null : parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear all errors at the start of submission
    setIsSubmitting(true);

    let newErrors: { bodyTemperature?: string; bodyWeight?: string; catatan?: string; general?: string } = {};
    const bodyTemperature = Number(formData.bodyTemperature);
    const bodyWeight = Number(formData.bodyWeight);

    if (isNaN(bodyTemperature) || formData.bodyTemperature === null) {
      newErrors.bodyTemperature = 'Suhu tubuh harus berupa angka bulat dan tidak boleh kosong.';
    } else if (bodyTemperature < 30 || bodyTemperature > 45) {
      newErrors.bodyTemperature = 'Suhu tubuh harus antara 30 dan 45 °C.';
    }

    if (isNaN(bodyWeight) || formData.bodyWeight === null) {
      newErrors.bodyWeight = 'Berat badan harus berupa angka dan tidak boleh kosong.';
    } else if (bodyWeight <= 0) {
      newErrors.bodyWeight = 'Berat badan harus lebih dari 0 kg.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast.error('Harap perbaiki kesalahan dalam formulir.');
      return;
    }

    try {
      const completeData = {
        bodyTemperature,
        bodyWeight,
        catatan: formData.catatan,
        nama_hewan: petName,
        no_identitas_klien: clientId,
        no_front_desk: frontDeskId,
        no_perawat_hewan: nurseId,
        no_dokter_hewan: doctorId,
      };

      if (onSubmit) {
        onSubmit({ bodyTemperature, bodyWeight, catatan: formData.catatan });
      }
      await updateRekamMedis(id, completeData);
      toast.success('Rekam medis berhasil diperbarui');
      onClose();
    } catch (error) {
      console.error('Error updating medical record:', error);
      setErrors(prev => ({ ...prev, general: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan.' }));
      toast.error('Gagal memperbarui rekam medis');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setErrors({}); // Clear errors when starting to create
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setErrors({}); // Clear errors when starting to edit
  };

  const handleCancel = () => {
    setErrors({}); // Clear errors on cancel
    if (existingData && (existingData.bodyTemperature !== null || existingData.bodyWeight !== null || existingData.catatan !== null)) {
      setIsEditing(false);
      setFormData(existingData);
    } else {
      setShowForm(false);
      setFormData({ bodyTemperature: null, bodyWeight: null, catatan: '' }); // Reset form data if creating and canceling
    }
  };

  if (!isOpen) return null;

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

  // Determine if the form should be shown (either editing existing data or creating new when no data exists)
  const shouldShowForm = (existingData && isEditing) || (!existingData && showForm) || (existingData && existingData.bodyTemperature === null && existingData.bodyWeight === null && existingData.catatan === null && showForm);

  if (shouldShowForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {existingData && (existingData.bodyTemperature !== null || existingData.bodyWeight !== null || existingData.catatan !== null) ? 'Edit Rekam Medis' : 'Buat Rekam Medis'}
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
                  step="1"
                  name="bodyTemperature"
                  value={formData.bodyTemperature === null ? '' : formData.bodyTemperature}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.bodyTemperature ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  aria-label="Body temperature"
                />
                {errors.bodyTemperature && <p className="text-red-500 text-xs mt-1">{errors.bodyTemperature}</p>}
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
                  value={formData.bodyWeight === null ? '' : formData.bodyWeight}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.bodyWeight ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  aria-label="Body weight"
                />
                {errors.bodyWeight && <p className="text-red-500 text-xs mt-1">{errors.bodyWeight}</p>}
              </div>

              <div>
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  value={formData.catatan === null ? '' : formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full p-2 border ${errors.catatan ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  aria-label="Medical notes"
                />
                {errors.catatan && <p className="text-red-500 text-xs mt-1">{errors.catatan}</p>}
              </div>

              {errors.general && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.general}
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

  if (existingData && (existingData.bodyTemperature !== null || existingData.bodyWeight !== null || existingData.catatan !== null)) {
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
                <p className="font-medium">{existingData.bodyTemperature || 0}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Berat Badan</p>
                <p className="font-medium">{existingData.bodyWeight || 0} kg</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Catatan</p>
              <p className="font-medium whitespace-pre-line">{existingData.catatan || 'Tidak ada catatan.'}</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                aria-label="Close"
              >
                Tutup
              </button>
              {userRole === 'dokter-hewan' && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  aria-label="Edit medical record"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {userRole === 'dokter-hewan' && (
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Create medical record"
              >
                Buat Rekam Medis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}