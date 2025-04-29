"use client";

import { useState } from 'react';
import { FaPlus, FaFileMedical, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import RekamMedisModal from './components/RekamMedisModal';

type Kunjungan = {
  id: string;
  clientId: string;
  petName: string;
  petType: string;
  visitType: 'Walk-In' | 'Janji Temu' | 'Darurat';
  startTime: string;
  endTime: string;
};

type RekamMedis = {
  suhuTubuh: string;
  beratBadan: string;
  jenisPerawatan: string;
  catatan: string;
  waktuPerawatan: string;
};

export default function VisitPage() {
  const router = useRouter();
  
  // State for visits data
  const [visits, setVisits] = useState<Kunjungan[]>([
    {
      id: 'KJ-2023-001',
      clientId: 'CL-00123',
      petName: 'Max',
      petType: 'Kucing',
      visitType: 'Janji Temu',
      startTime: '2023-05-15T10:00:00',
      endTime: '2023-05-15T11:30:00',
    },
    {
      id: 'KJ-2023-002',
      clientId: 'CL-00456',
      petName: 'Bella',
      petType: 'Anjing',
      visitType: 'Walk-In',
      startTime: '2023-05-16T14:00:00',
      endTime: '2023-05-16T15:15:00',
    },
  ]);

  // State for medical records
  const [medicalRecords, setMedicalRecords] = useState<Record<string, RekamMedis>>({
    'KJ-2023-001': {
      suhuTubuh: '38',
      beratBadan: '12.3',
      jenisPerawatan: 'Vaksinasi',
      catatan: 'Lorem Ipsum Dolor Sir Ahjirfbgfbjbnjvbnkg bhjbbjhj',
      waktuPerawatan: '2023-05-15T10:30:00',
    }
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [currentKunjungan, setCurrentKunjungan] = useState<Kunjungan | null>(null);
  const [kunjunganToDelete, setKunjunganToDelete] = useState('');
  const [currentVisitId, setCurrentVisitId] = useState('');

  // Form state
  const [formData, setFormData] = useState<Omit<Kunjungan, 'id' | 'petType'>>({
    clientId: '',
    petName: '',
    visitType: 'Walk-In',
    startTime: '',
    endTime: '',
  });

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newKunjungan: Kunjungan = {
      ...formData,
      id: `KJ-${new Date().getFullYear()}-${(visits.length + 1).toString().padStart(3, '0')}`,
      petType: formData.petName === 'Max' ? 'Kucing' : 'Anjing'
    };
    setVisits([...visits, newKunjungan]);
    setShowCreateModal(false);
    resetForm();
  };

  const prepareUpdate = (kunjungan: Kunjungan) => {
    setCurrentKunjungan(kunjungan);
    setFormData({
      clientId: kunjungan.clientId,
      petName: kunjungan.petName,
      visitType: kunjungan.visitType,
      startTime: kunjungan.startTime,
      endTime: kunjungan.endTime,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKunjungan) return;
    
    const updatedVisits = visits.map(v => 
      v.id === currentKunjungan.id ? { ...v, ...formData } : v
    );
    setVisits(updatedVisits);
    setShowUpdateModal(false);
    resetForm();
  };

  const prepareDelete = (id: string) => {
    setKunjunganToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setVisits(visits.filter(v => v.id !== kunjunganToDelete));
    setShowDeleteModal(false);
  };

  const handleShowMedicalRecord = (visitId: string) => {
    setCurrentVisitId(visitId);
    setShowMedicalRecordModal(true);
  };

  const handleSaveMedicalRecord = (data: RekamMedis) => {
    setMedicalRecords(prev => ({
      ...prev,
      [currentVisitId]: data
    }));
    setShowMedicalRecordModal(false);
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      petName: '',
      visitType: 'Walk-In',
      startTime: '',
      endTime: '',
    });
  };

  const KunjunganModal = ({ isCreate }: { isCreate: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isCreate ? 'Buat Kunjungan Baru' : 'Edit Kunjungan'}
          </h2>
          <button 
            onClick={() => isCreate ? setShowCreateModal(false) : setShowUpdateModal(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={isCreate ? handleCreate : handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Klien</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih ID Klien</option>
              <option value="CL-00123">CL-00123</option>
              <option value="CL-00456">CL-00456</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Hewan</label>
            <select
              name="petName"
              value={formData.petName}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih Nama Hewan</option>
              <option value="Max">Max</option>
              <option value="Bella">Bella</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Kunjungan</label>
            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Walk-In">Walk-In</option>
              <option value="Janji Temu">Janji Temu</option>
              <option value="Darurat">Darurat</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => isCreate ? setShowCreateModal(false) : setShowUpdateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isCreate ? 'Buat' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Hapus Kunjungan</h2>
          <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <p>Apakah kamu yakin untuk menghapus</p>
          <p className="font-semibold">KUNJUNGAN dengan ID {kunjunganToDelete}?</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
    className="min-h-screen bg-cover bg-center px-4 py-10"
    // style={{ backgroundImage: "url('/background.png')" }}
  >
    <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">List Kunjungan</h1>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#FD7E14] hover:bg-[#E67112] text-white px-4 py-2 rounded-md"
        >
          + Buat Kunjungan Baru
        </button>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Kunjungan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Klien</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Mulai</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rekam Medis</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.clientId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {visit.petName} ({visit.petType})
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    visit.visitType === 'Walk-In' ? 'bg-blue-100 text-blue-800' : 
                    visit.visitType === 'Janji Temu' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {visit.visitType}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDateTime(visit.startTime)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDateTime(visit.endTime)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => handleShowMedicalRecord(visit.id)}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    <FaFileMedical className="mr-1" />
                    Rekam
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                  <button 
                    onClick={() => prepareUpdate(visit)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => prepareDelete(visit.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && <KunjunganModal isCreate={true} />}
      {showUpdateModal && <KunjunganModal isCreate={false} />}
      {showDeleteModal && <DeleteModal />}
      {showMedicalRecordModal && (
        <RekamMedisModal
          isOpen={showMedicalRecordModal}
          onClose={() => setShowMedicalRecordModal(false)}
          onSubmit={handleSaveMedicalRecord}
          existingData={medicalRecords[currentVisitId] || null}
        />
      )}
    </div>
    </div>
  );
}