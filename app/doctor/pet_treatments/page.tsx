'use client';
import { useState, useRef, useEffect } from 'react';

// Define the Treatment type for better type safety
interface Treatment {
  id: number;
  visitId: string;
  animalName: string;
  clientId: string;
  frontDeskId: string;
  nurseId: string;
  doctorId: string;
  treatmentCode: string;
  treatmentNotes: string;
}

// Define the FormData type
interface FormData {
  visitId: string;
  animalName: string;
  clientId: string;
  frontDeskId: string;
  nurseId: string;
  doctorId: string;
  treatmentCode: string;
  treatmentNotes: string;
}

export default function TreatmentManagement() {
  // Dummy data with typed state
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: 1,
      visitId: 'KJN001',
      animalName: 'Muezza',
      clientId: '4d925fd2-7ab6-4409-83c9-0c0e586d0e87',
      frontDeskId: 'e3a9db95-4ac8-4b9d-9182-35f2c511fa74',
      nurseId: 'd2f781d2-3df4-4c10-9336-85bc91eb37cf',
      doctorId: '69d3a2d1-5f80-4e86-961e-6b83eac1d6ae',
      treatmentCode: 'TRM001',
      treatmentNotes: 'Pemeriksaan umum lengkap; suhu, nadi, dan berat badan normal.',
    },
    {
      id: 2,
      visitId: 'KJN002',
      animalName: 'Simba',
      clientId: '91e9840f-7a45-48c3-9ce2-d23b48135b99',
      frontDeskId: 'b5f2ff4e-50c3-43ce-bf89-4863f4cbf582',
      nurseId: '9d96cf4c-1952-4ec9-81f0-63c94a1576b9',
      doctorId: '0a6f60b1-9dd2-4ce0-8054-13b4631d26ef',
      treatmentCode: 'TRM002',
      treatmentNotes: 'Telinga dibersihkan; diberikan tetes telinga antibakteri.',
    },
  ]);

  // Dummy data for available visits and treatments
  const availableVisits: string[] = ['KJN001', 'KJN002'];
  const availableTreatments: string[] = ['TRM001', 'TRM002', 'TRM003', 'TRM004', 'TRM005'];

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(null);

  // Separate state for textarea to prevent cursor jumping
  const [notesValue, setNotesValue] = useState<string>('');

  // Form state with typed FormData
  const [formData, setFormData] = useState<FormData>({
    visitId: '',
    animalName: '',
    clientId: '',
    frontDeskId: '',
    nurseId: '',
    doctorId: '',
    treatmentCode: '',
    treatmentNotes: '',
  });

  // Ref for textarea
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Update notesValue when formData changes (for loading initial data)
  useEffect(() => {
    setNotesValue(formData.treatmentNotes);
  }, [formData.treatmentNotes]);

  // Handle form input changes except textarea with explicit event type
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name !== 'treatmentNotes') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle textarea changes separately
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotesValue(e.target.value);
  };

  // Create new treatment
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTreatment: Treatment = {
      id: treatments.length + 1,
      ...formData,
      treatmentNotes: notesValue,
    };
    setTreatments([...treatments, newTreatment]);
    setShowCreateModal(false);
    setFormData({
      visitId: '',
      animalName: '',
      clientId: '',
      frontDeskId: '',
      nurseId: '',
      doctorId: '',
      treatmentCode: '',
      treatmentNotes: '',
    });
    setNotesValue('');
  };

  // Prepare update modal
  const prepareUpdate = (treatment: Treatment) => {
    setCurrentTreatment(treatment);
    setFormData({
      visitId: treatment.visitId,
      animalName: treatment.animalName,
      clientId: treatment.clientId,
      frontDeskId: treatment.frontDeskId,
      nurseId: treatment.nurseId,
      doctorId: treatment.doctorId,
      treatmentCode: treatment.treatmentCode,
      treatmentNotes: treatment.treatmentNotes,
    });
    setNotesValue(treatment.treatmentNotes);
    setShowUpdateModal(true);
  };

  // Update treatment
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData: FormData = {
      ...formData,
      treatmentNotes: notesValue,
    };
    const updated = treatments.map((t) =>
      t.id === currentTreatment!.id ? { ...t, ...updatedData } : t
    );
    setTreatments(updated);
    setShowUpdateModal(false);
  };

  // Delete treatment
  const handleDelete = () => {
    setTreatments(treatments.filter((t) => t.id !== currentTreatment!.id));
    setShowDeleteModal(false);
  };

  // Create/Update Modal Component
  const TreatmentFormModal = ({ isUpdate = false }: { isUpdate?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">
            {isUpdate ? 'Update Treatment' : 'Create New Treatment'}
          </h2>

          <form onSubmit={isUpdate ? handleUpdate : handleCreate} className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Kunjungan</h3>
              <select
                name="visitId"
                value={formData.visitId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Pilih Kunjungan</option>
                {availableVisits.map((visit) => (
                  <option key={visit} value={visit}>
                    {visit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Jenis Perawatan</h3>
              <select
                name="treatmentCode"
                value={formData.treatmentCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Jenis Perawatan</option>
                {availableTreatments.map((treatment) => (
                  <option key={treatment} value={treatment}>
                    {treatment}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Catatan</h3>
              <textarea
                name="treatmentNotes"
                value={notesValue}
                onChange={handleNotesChange}
                ref={notesTextareaRef}
                className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="button"
                onClick={isUpdate ? () => setShowUpdateModal(false) : () => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#FD7E14] text-white rounded-md font-medium"
              >
                {isUpdate ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Delete Treatment</h2>
          <p className="text-center mb-6">
            Apakah kamu yakin untuk menghapus Perawatan untuk Kunjungan{' '}
            {currentTreatment?.visitId} dengan Perawatan {currentTreatment?.treatmentCode}?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded-md font-medium"
            >
              Confirm Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center px-4 py-10">
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List Perawatan</h1>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              setFormData({
                visitId: '',
                animalName: '',
                clientId: '',
                frontDeskId: '',
                nurseId: '',
                doctorId: '',
                treatmentCode: '',
                treatmentNotes: '',
              });
              setNotesValue('');
              setCurrentTreatment(null);
              setShowCreateModal(true);
            }}
            className="bg-[#FD7E14] hover:bg-[#E67112] text-white px-4 py-2 rounded-md"
          >
            + Create New Treatment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Visit ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama Hewan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  FrontDesk ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nurse ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kode Treatment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Catatan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {treatments.map((treatment, index) => (
                <tr key={treatment.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{treatment.visitId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.animalName}</td>
                  <td className="px-4 py-3 text-sm">{treatment.clientId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.frontDeskId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.nurseId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.doctorId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.treatmentCode}</td>
                  <td className="px-4 py-3 text-sm">{treatment.treatmentNotes}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <div className="flex flex-col w-24">
                      <button
                        onClick={() => prepareUpdate(treatment)}
                        className="bg-black text

-white px-3 py-1 rounded hover:bg-gray-800 w-full"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTreatment(treatment);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 text-white px-3 py-1 mt-2 rounded hover:bg-red-700 w-full"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showCreateModal && <TreatmentFormModal />}
        {showUpdateModal && <TreatmentFormModal isUpdate />}
        {showDeleteModal && <DeleteConfirmationModal />}
      </div>
    </div>
  );
}