'use client';
import { useState, useRef, useEffect } from 'react';

<<<<<<< HEAD
export default function TreatmentListManagement() {
  // Dummy data
  const [treatments, setTreatments] = useState([
    { id: 1, visitId: 'KJN001', animalName: 'Muezza', clientId: '4d925fd2-7ab6-4409-83c9-0c0e586d0e87', frontDeskId: 'James Martin', nurseId: 'Andrew Clark', doctorId: 'dr. Sophia Taylor', treatmentCode: 'TRM001 - Pemeriksaan Umum', treatmentNotes: 'Pemeriksaan umum lengkap; suhu, nadi, dan berat badan normal.' },
    { id: 2, visitId: 'KJN002', animalName: 'Simba', clientId: '91e9840f-7a45-48c3-9ce2-d23b48135b99', frontDeskId: 'Lisa White', nurseId: 'Emily Wilson', doctorId: 'dr. Charles Brown', treatmentCode: 'TRM005 - Penanganan Luka Ringan', treatmentNotes: 'Telinga dibersihkan; diberikan tetes telinga antibakteri.' }
  ]);

  // Dummy data for available visits and animals
  const availableVisits = ['KJN001', 'KJN002'];
  const availableTreatments = ['TRM001 - Pemeriksaan Umum', 'TRM002 - Pembersihan Telinga', 'TRM003 - Perawatan Bulu dan Kuku', 'TRM004 - Perawatan Reproduksi', 'TRM005 - Penanganan Luka Ringan'];
  const visitDetails = [
    {
      visitId: 'KJN001',
      animalName: 'Muezza',
      clientId: '4d925fd2-7ab6-4409-83c9-0c0e586d0e87',
      frontDeskId: 'James Martin',
      nurseId: 'Andrew Clark',
      doctorId: 'dr. Sophia Taylor'
    },
    {
      visitId: 'KJN002',
      animalName: 'Simba',
      clientId: '91e9840f-7a45-48c3-9ce2-d23b48135b99',
      frontDeskId: 'Lisa White',
      nurseId: 'Emily Wilson',
      doctorId: 'dr. Charles Brown'
    }
  ];
  

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);
  
  // Separate state for textarea to prevent cursor jumping
  const [notesValue, setNotesValue] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
=======
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
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    visitId: '',
    animalName: '',
    clientId: '',
    frontDeskId: '',
    nurseId: '',
    doctorId: '',
    treatmentCode: '',
<<<<<<< HEAD
    treatmentNotes: ''
  });
  
  // Ref for textarea
  const notesTextareaRef = useRef(null);
=======
    treatmentNotes: '',
  });

  // Ref for textarea
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363

  // Update notesValue when formData changes (for loading initial data)
  useEffect(() => {
    setNotesValue(formData.treatmentNotes);
  }, [formData.treatmentNotes]);

<<<<<<< HEAD
  useEffect(() => {
  const selectedVisit = visitDetails.find(v => v.visitId === formData.visitId);
  if (selectedVisit) {
    setFormData(prev => ({
      ...prev,
      animalName: selectedVisit.animalName,
      clientId: selectedVisit.clientId,
      frontDeskId: selectedVisit.frontDeskId,
      nurseId: selectedVisit.nurseId,
      doctorId: selectedVisit.doctorId
    }));
  }
}, [formData.visitId]);


  // Handle form input changes except textarea
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'treatmentNotes') {
      setFormData(prev => ({ ...prev, [name]: value }));
=======
  // Handle form input changes except textarea with explicit event type
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name !== 'treatmentNotes') {
      setFormData((prev) => ({ ...prev, [name]: value }));
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    }
  };

  // Handle textarea changes separately
<<<<<<< HEAD
  const handleNotesChange = (e) => {
=======
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    setNotesValue(e.target.value);
  };

  // Create new treatment
<<<<<<< HEAD
  const handleCreate = (e) => {
    e.preventDefault();
    const newTreatment = {
      id: treatments.length + 1,
      ...formData,
      treatmentNotes: notesValue
    };
    setTreatments([...treatments, newTreatment]);
    setShowCreateModal(false);
    setFormData({ visitId: '', animalName: '', clientId: '', frontDeskId: '', nurseId: '', doctorId: '', treatmentCode: '', treatmentNotes: '' });
=======
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
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    setNotesValue('');
  };

  // Prepare update modal
<<<<<<< HEAD
  const prepareUpdate = (treatment) => {
=======
  const prepareUpdate = (treatment: Treatment) => {
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    setCurrentTreatment(treatment);
    setFormData({
      visitId: treatment.visitId,
      animalName: treatment.animalName,
      clientId: treatment.clientId,
      frontDeskId: treatment.frontDeskId,
      nurseId: treatment.nurseId,
      doctorId: treatment.doctorId,
      treatmentCode: treatment.treatmentCode,
<<<<<<< HEAD
      treatmentNotes: treatment.treatmentNotes
=======
      treatmentNotes: treatment.treatmentNotes,
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    });
    setNotesValue(treatment.treatmentNotes);
    setShowUpdateModal(true);
  };

  // Update treatment
<<<<<<< HEAD
  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      treatmentNotes: notesValue
    };
    const updated = treatments.map(t => 
      t.id === currentTreatment.id ? { ...t, ...updatedData } : t
=======
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData: FormData = {
      ...formData,
      treatmentNotes: notesValue,
    };
    const updated = treatments.map((t) =>
      t.id === currentTreatment!.id ? { ...t, ...updatedData } : t
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    );
    setTreatments(updated);
    setShowUpdateModal(false);
  };

  // Delete treatment
  const handleDelete = () => {
<<<<<<< HEAD
    setTreatments(treatments.filter(t => t.id !== currentTreatment.id));
=======
    setTreatments(treatments.filter((t) => t.id !== currentTreatment!.id));
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    setShowDeleteModal(false);
  };

  // Create/Update Modal Component
<<<<<<< HEAD
  const TreatmentFormModal = ({ isUpdate = false }) => (
=======
  const TreatmentFormModal = ({ isUpdate = false }: { isUpdate?: boolean }) => (
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">
            {isUpdate ? 'Update Treatment' : 'Create New Treatment'}
          </h2>
<<<<<<< HEAD
          
=======

>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
          <form onSubmit={isUpdate ? handleUpdate : handleCreate} className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Kunjungan</h3>
              <select
                name="visitId"
                value={formData.visitId}
                onChange={handleInputChange}
<<<<<<< HEAD
                className={`w-full border rounded-md p-2 
                  ${isUpdate ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'}`}
                required
                disabled={isUpdate}
              >
                <option value="">Pilih Kunjungan</option>
                {availableVisits.map((visit) => (
                  <option key={visit} value={visit}>{visit}</option>
                ))}
                
              </select>
              {/* ///ambil value nama hewa, client id, id rfotnr deks, id perawat, id dokter dari knj yang dipilih */}
=======
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
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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
<<<<<<< HEAD
                  <option key={treatment} value={treatment}>{treatment}</option>
=======
                  <option key={treatment} value={treatment}>
                    {treatment}
                  </option>
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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
<<<<<<< HEAD
            Apakah kamu yakin untuk menghapus Perawatan untuk Kunjungan {currentTreatment?.visitId} dengan Perawatan {currentTreatment?.treatmentCode}?
=======
            Apakah kamu yakin untuk menghapus Perawatan untuk Kunjungan{' '}
            {currentTreatment?.visitId} dengan Perawatan {currentTreatment?.treatmentCode}?
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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
<<<<<<< HEAD
    <div
      className="min-h-screen bg-cover bg-center px-4 py-10"
      // style={{ backgroundImage: "url('/background.png')" }}
    >
=======
    <div className="min-h-screen bg-cover bg-center px-4 py-10">
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List Perawatan</h1>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
<<<<<<< HEAD
              setFormData({ 
                visitId: '', 
                animalName: '', 
                clientId: '', 
                frontDeskId: '', 
                nurseId: '', 
                doctorId: '', 
                treatmentCode: '', 
                treatmentNotes: '' 
=======
              setFormData({
                visitId: '',
                animalName: '',
                clientId: '',
                frontDeskId: '',
                nurseId: '',
                doctorId: '',
                treatmentCode: '',
                treatmentNotes: '',
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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
<<<<<<< HEAD
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visit ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">FrontDesk ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nurse ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode Treatment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
=======
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
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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
<<<<<<< HEAD
                        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 w-full"
=======
                        className="bg-black text

-white px-3 py-1 rounded hover:bg-gray-800 w-full"
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
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