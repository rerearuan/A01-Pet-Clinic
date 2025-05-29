'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select'; // Import react-select
import { StaffMember } from '../visits/page';
import { StaffRole } from '../visits/page';
import { Klien } from '../visits/page';

// Tipe data
interface VisitedTreatment {
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

interface TreatmentName {
  code: string;
  name: string;
}

interface Email {
  id: string;
  email_user: string;
}

export interface Visit {
  visitId: string;
  animalname: string;
  clientid: string;
  frontdeskid: string;
  doctorid: string;
  nurseid: string;
}


export default function TreatmentManagement() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [clients, setClients] = useState<Klien[]>([]);
  const [treatments, setTreatments] = useState<VisitedTreatment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [availableVisits, setAvailableVisits] = useState<Visit[]>([]);
  const [availableTreatments, setAvailableTreatments] = useState<TreatmentName[]>([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState<VisitedTreatment | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [notesValue, setNotesValue] = useState('');
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

  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pet_treatments/get_or_post_pet_treatments');
        if (!res.ok) {
          throw new Error('Failed to fetch treatments');
        }
        const json = await res.json();
        setTreatments(json.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/visits/get-client');
        const data = await res.json();
        setClients(data.data);
      } catch (error) {
        console.error("Gagal mengambil data client:", error);
      }
    };
    fetchClients();
  }, []);


  useEffect(() => {
    const fetchVisitTreatment = async () => {
      try {
        const res = await fetch('/api/pet_treatments/get_visit_id');
        if (!res.ok) throw new Error('Failed to fetch visits');
        const json = await res.json();
        setAvailableVisits(json.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVisitTreatment();
  }, []);
  console.log('fetch visit semua', availableVisits)

  useEffect(() => {
    const fetchTreatmentCode = async () => {
      try {
        const res = await fetch('/api/pet_treatments/get_treatment_code');
        if (!res.ok) throw new Error('Failed to fetch treatments');
        const json = await res.json();
        console.log('Response JSON:', json);

        // Create an array of objects with both code and name
        const treatments = json.data.map((item: {
          kode_perawatan: string,
          nama_perawatan: string
        }) => ({
          code: item.kode_perawatan,
          name: item.nama_perawatan
        }));

        console.log('Treatments:', treatments);
        setAvailableTreatments(treatments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTreatmentCode();
  }, []);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const res = await fetch('/api/visits/get_staff');
        if (!res.ok) throw new Error('Failed to fetch staff data');
        const json = await res.json();
        setStaffMembers(json.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, []);

  const getIdByEmail = (email: string): string | undefined => {
    // Cari di data staff terlebih dahulu
    const staff = staffMembers.find(member => member.email_user === email);
    if (staff) return staff.id;

    // Jika tidak ditemukan di staff, cari di data client
    const client = clients.find(client => client.email === email);
    return client?.no_identitas;
  };

  const id_user = getIdByEmail(session?.user.email || '');


  // Sinkronisasi notesValue ketika treatmentNotes berubah
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

  const fetchVisitDetail = async (visitId: string) => {
    const res = await fetch(`/api/pet_treatments/${visitId}`);
    if (!res.ok) throw new Error('Failed to fetch visit detail');
    const data = await res.json();
    setFormData({
      visitId,
      animalName: data.data.nama_hewan, // Perhatikan field yang sesuai dengan response
      clientId: data.data.no_identitas_klien,
      frontDeskId: data.data.no_front_desk,
      nurseId: data.data.no_perawat_hewan,
      doctorId: data.data.no_dokter_hewan,
      treatmentCode: '',
      treatmentNotes: '',
    });
    setShowCreateModal(true);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Siapkan data sesuai dengan yang diharapkan backend
      const requestBody = {
        id_kunjungan: formData.visitId, // Perhatikan field ini berbeda dari sebelumnya
        nama_hewan: formData.animalName,
        no_identitas_klien: formData.clientId,
        no_front_desk: formData.frontDeskId,
        no_perawat_hewan: formData.nurseId,
        no_dokter_hewan: formData.doctorId,
        kode_perawatan: formData.treatmentCode
      };

      console.log('Sending POST request with:', requestBody);

      const response = await fetch('/api/pet_treatments/get_or_post_pet_treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to create treatment');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Refresh data treatments setelah berhasil create
      const refreshResponse = await fetch('/api/pet_treatments/get_or_post_pet_treatments');
      const refreshData = await refreshResponse.json();
      setTreatments(refreshData.data);

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error in handleCreate:', error);
      setError(error instanceof Error ? error.message : 'Failed to create treatment');
    }
  };

  // Modified handleVisitSelect for react-select
  const handleVisitSelect = async (selectedOption: { value: string; label: React.ReactNode } | null) => {
    const visitId = selectedOption ? selectedOption.value : '';
    if (visitId) {
      await fetchVisitDetail(visitId);
    }
  };


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentTreatment) return;

    try {
      // Perhatikan bahwa kita mengirim kode_perawatan_lama dari currentTreatment
      // dan kode_perawatan_baru dari formData (yang diisi oleh user di modal)
      const requestBody = {
        kode_perawatan_baru: formData.treatmentCode,
        kode_perawatan_lama: currentTreatment.treatmentCode,
        // Parameter lain yang diperlukan oleh WHERE clause di backend
        nama_hewan: currentTreatment.animalName, // Menggunakan currentTreatment karena ini adalah kunci identifikasi
        no_identitas_klien: currentTreatment.clientId,
        no_front_desk: currentTreatment.frontDeskId,
        no_perawat_hewan: currentTreatment.nurseId,
        no_dokter_hewan: currentTreatment.doctorId,
      };

      console.log('Frontend PUT: Sending request body:', requestBody);
      console.log('Frontend PUT: Sending to URL:', `/api/pet_treatments/${currentTreatment.visitId}`);

      const response = await fetch(`/api/pet_treatments/${currentTreatment.visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Frontend PUT: Error response:', errorData);
        throw new Error(errorData.message || 'Failed to update treatment');
      }

      const result = await response.json();
      console.log('Frontend PUT: Success response:', result);

      setShowUpdateModal(false);
      // Memanggil fetchData untuk merefresh data setelah update
      // Ini adalah cara paling andal untuk memastikan data di tabel konsisten
      const refreshResponse = await fetch('/api/pet_treatments/get_or_post_pet_treatments');
      const refreshData = await refreshResponse.json();
      setTreatments(refreshData.data);
    } catch (error) {
      console.error('Frontend PUT: Error in handleUpdate:', error);
      setError(error instanceof Error ? error.message : 'Failed to update treatment');
    }
  };


  // Delete treatment
  const handleDelete = async () => {
    if (!currentTreatment) return;

    try {
      const response = await fetch('/api/pet_treatments/get_or_post_pet_treatments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId: currentTreatment.visitId,
          animalName: currentTreatment.animalName,
          clientId: currentTreatment.clientId,
          frontDeskId: currentTreatment.frontDeskId,
          nurseId: currentTreatment.nurseId,
          doctorId: currentTreatment.doctorId,
          treatmentCode: currentTreatment.treatmentCode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete treatment');
      }


      const refreshResponse = await fetch('/api/pet_treatments/get_or_post_pet_treatments');
      const refreshData = await refreshResponse.json();
      setTreatments(refreshData.data);
      setShowDeleteModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete treatment');
    }
  };

  // Reset form
  const resetForm = () => {
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
  const prepareUpdate = (treatment: VisitedTreatment) => {
    setCurrentTreatment(treatment); // Menyimpan objek treatment lengkap
    setFormData({
      visitId: treatment.visitId,
      animalName: treatment.animalName,
      clientId: treatment.clientId,
      frontDeskId: treatment.frontDeskId,
      nurseId: treatment.nurseId,
      doctorId: treatment.doctorId,
      treatmentCode: treatment.treatmentCode, // Ini adalah kode perawatan LAMA saat ini
      treatmentNotes: treatment.treatmentNotes,
    });
    setNotesValue(treatment.treatmentNotes);
    setShowUpdateModal(true);
  };
  console.log('user id', id_user)
  console.log('doctorId pertama:', availableVisits.length > 0 ? availableVisits[0].doctorid : 'tidak ada data');
  const filteredVisits = availableVisits //.filter(visit => visit.doctorid === id_user);
  console.log('filter', filteredVisits)
  // Create/Update Modal Component

  function formatEmailName(email: string) {
    if (!email) return "";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Custom styles for react-select to handle multi-line labels
  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      whiteSpace: 'normal', // Allow text to wrap
      height: 'auto', // Adjust height based on content
      padding: '8px 12px', // Add some padding
      borderBottom: '1px dotted #ccc', // Optional: separator
    }),
    singleValue: (provided: any) => ({
      ...provided,
      whiteSpace: 'normal',
      overflow: 'visible',
      textOverflow: 'unset',
      height: 'auto',
    }),
    control: (provided: any) => ({
      ...provided,
      height: 'auto', // Allow control to grow with content
      minHeight: '38px', // Default min-height
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999, // Ensure the dropdown is above other elements
    }),
  };


  const TreatmentFormModal = ({ isUpdate = false }: { isUpdate?: boolean }) => {
    // Map availableVisits to options for react-select
    const visitOptions = filteredVisits.map((visit) => {
      const frontDeskEmail = staffMembers.find(staff => staff.id === visit.frontdeskid)?.email_user || visit.frontdeskid;
      const doctorEmail = staffMembers.find(staff => staff.id === visit.doctorid)?.email_user || visit.doctorid;
      const nurseEmail = staffMembers.find(staff => staff.id === visit.nurseid)?.email_user || visit.nurseid;

      return {
        value: visit.visitId,
        label: (
          <div>
            <div>ID Kunjungan: {visit.visitId}</div>
            <div>Nama Hewan: {visit.animalname}</div>
            <div>ID Klien: {visit.clientid}</div>
            <div>Front Desk: {formatEmailName(frontDeskEmail)}</div>
            <div>Dokter: {formatEmailName(doctorEmail)}</div>
            <div>Perawat: {formatEmailName(nurseEmail)}</div>
          </div>
        ),
      };
    });

    // Find the currently selected option object for react-select
    const selectedVisitOption = visitOptions.find(option => option.value === formData.visitId) || null;


    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-center">
              {isUpdate ? 'Update Treatment' : 'Create New Treatment'}
            </h2>

            <form onSubmit={isUpdate ? handleUpdate : handleCreate} className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Kunjungan</h3>
                <Select
                  name="visitId"
                  options={visitOptions}
                  value={selectedVisitOption} // Set value as the selected option object
                  onChange={handleVisitSelect} // Use the modified handler
                  className="w-full"
                  classNamePrefix="react-select" // Optional: for custom styling
                  isDisabled={isUpdate} // Disable if updating
                  placeholder="Pilih Kunjungan"
                  styles={customStyles} // Apply custom styles
                />
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
                    <option key={treatment.code} value={treatment.code}>
                      {treatment.name} {/* Tampilkan nama, tapi value-nya adalah kode */}
                    </option>
                  ))}
                </select>
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
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center px-4 py-10">
        <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md text-center">
          Loading treatments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center px-4 py-10">
        <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center px-4 py-10">
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List Perawatan</h1>
        </div>

        <div className="mb-4 flex justify-end">
          {userRole === 'dokter-hewan' && <button
            onClick={() => {
              resetForm();
              setCurrentTreatment(null);
              setShowCreateModal(true);
            }}
            className="bg-[#FD7E14] hover:bg-[#E67112] text-white px-4 py-2 rounded-md"
          >
            + Create New Treatment
          </button>}
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
                { userRole==='dokter-hewan' && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>}
              </tr>
            </thead>

            <tbody>
              {treatments.filter(treatment => {
                if (userRole === "front-desk") return true;

                if (userRole === "dokter-hewan") return true;

                if (userRole === "perawat-hewan") return true;

                if (userRole === "individu" || userRole === "perusahaan") return treatment.clientId === id_user;

                return false;
              }).map((treatment, index) => (
                <tr
                  key={`${treatment.animalName}-${treatment.clientId}-${treatment.frontDeskId}-${treatment.nurseId}-${treatment.doctorId}-${treatment.treatmentCode}`}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{treatment.visitId}</td>
                  <td className="px-4 py-3 text-sm">{treatment.animalName}</td>
                  <td className="px-4 py-3 text-sm">{treatment.clientId}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatEmailName(staffMembers.find(staff => staff.id === treatment.frontDeskId)?.email_user || treatment.frontDeskId)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatEmailName(staffMembers.find(staff => staff.id === treatment.nurseId)?.email_user || treatment.nurseId)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    dr. {formatEmailName(staffMembers.find(staff => staff.id === treatment.doctorId)?.email_user || treatment.doctorId)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {availableTreatments.find(t => t.code === treatment.treatmentCode)?.name || treatment.treatmentCode}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    {userRole === 'dokter-hewan' && <div className="flex flex-col w-24">
                      <button
                        onClick={() => prepareUpdate(treatment)}
                        className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 w-full"
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
                    </div>}
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
