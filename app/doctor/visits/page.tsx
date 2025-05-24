// "use client";

// import { useSession } from "next-auth/react";
// import { useState, useEffect } from 'react';
// import { FaPlus, FaFileMedical, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
// import { useRouter } from 'next/navigation';
// import RekamMedisModal from './components/RekamMedisModal';
// // import { getSession } from '@/lib/auth-utils';


// type VisitType = 'Walk-In' | 'Janji Temu' | 'Darurat';
// export type StaffRole = 'front_desk' | 'dokter_hewan' | 'perawat_hewan';

// interface Kunjungan {
//   id: string;
//   clientId: string;
//   petName: string;
//   petType: string;
//   visitType: VisitType;
//   startTime: string;
//   endTime: string;
//   frontDeskId: string;
//   nurseId: string;
//   doctorId: string;
// }

// export interface RekamMedis {
//   bodyTemperature: number;
//   bodyWeight: number;
//   catatan: string;
// }

// export interface StaffMember {
//   id: string;
//   email_user: string;
//   role: StaffRole;
// }

// export interface Klien {
//   no_identitas: string;
//   email: string;
//   tanggal_registrasi: string;
// }

// interface Hewan {
//   nama: string;
//   no_identitas_klien: string;
//   tanggal_lahir: string;
//   id_jenis: string;
//   url_foto: string;
// }

// interface AppState {
//   visits: Kunjungan[];
//   medicalRecords: Record<string, RekamMedis>;
//   userEmails: StaffMember[];
//   klienList: Klien[];
//   hewanList: Hewan[];
//   loading: boolean;
//   loadingUsers: boolean;
//   isLoadingMedicalRecord: boolean;
//   error: string | null;
// }

// export function ErrorDisplay({
//   error,
//   onClose,
// }: {
//   error: string | null;
//   onClose: () => void;
// }) {
//   const [isVisible, setIsVisible] = useState(!!error);

//   useEffect(() => {
//     setIsVisible(!!error);
//   }, [error]);

//   if (!error || !isVisible) return null;

//   return (
//     <div className="relative p-4 mb-4 text-red-700 bg-white border border-red-300 rounded-lg shadow-sm">
//       <div className="flex items-start">
//         <span className="mr-2">⚠️</span>
//         <div className="flex-1">
//           <span className="font-medium"></span> {error}
//         </div>
//         <button
//           onClick={() => {
//             setIsVisible(false);
//             onClose();
//           }}
//           className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
//           aria-label="Close error message"
//         >
//           <span className="text-lg">&times;</span>
//         </button>
//       </div>
//     </div>
//   );
// }


// export default function VisitPage() {
//   const { data: session, status } = useSession();
//   const userRole = session?.user?.role;
  
//   // State management
//   const [state, setState] = useState<AppState>({
//     visits: [],
//     medicalRecords: {},
//     userEmails: [],
//     klienList: [],
//     hewanList: [],
//     loading: true,
//     loadingUsers: false,
//     isLoadingMedicalRecord: false,
//     error: null
//   });

//   const [modals, setModals] = useState({
//     showCreate: false,
//     showUpdate: false,
//     showDelete: false,
//     showMedicalRecord: false
//   });

//   const [form, setForm] = useState<Omit<Kunjungan, 'id' | 'petType'>>({
//     clientId: '',
//     petName: '',
//     visitType: 'Walk-In',
//     startTime: '',
//     endTime: '',
//     frontDeskId: '',
//     nurseId: '',
//     doctorId: ''
//   });

//   const [currentVisit, setCurrentVisit] = useState({
//     kunjungan: null as Kunjungan | null,
//     idToDelete: '',
//     currentVisitId: ''
//   });

//   const visitTypeOptions: VisitType[] = ['Walk-In', 'Janji Temu', 'Darurat'];

//   // Data Fetching
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setState(prev => ({ ...prev, loading: true }));
        
//         const [visitsResponse, staffResponse, klienResponse, hewanResponse] = await Promise.all([
//           fetch('/api/visits/get-or-post-visit'),
//           fetch('/api/visits/get_staff'),
//           fetch('/api/visits/get-client'),
//           fetch('/api/visits/get-pet')
//         ]);

//         if (!visitsResponse.ok || !staffResponse.ok || !klienResponse.ok || !hewanResponse.ok) {
//           throw new Error('Failed to fetch initial data');
//         }

//         const [visitsData, staffData, klienData, hewanData] = await Promise.all([
//           visitsResponse.json(),
//           staffResponse.json(),
//           klienResponse.json(),
//           hewanResponse.json()
//         ]);

//         setState(prev => ({
//           ...prev,
//           visits: visitsData.data,
//           userEmails: staffData.data,
//           klienList: klienData.data,
//           hewanList: hewanData.data,
//           loading: false
//         }));
//       } catch (error) {
//         setState(prev => ({
//           ...prev,
//           error: error instanceof Error ? error.message : 'Unknown error',
//           loading: false
//         }));
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const [error, setError] = useState<string | null>(null);

//   const getClientOptions = () => {
//     return state.klienList.map((klien: Klien) => ({
//       value: klien.no_identitas,
//       label: `${klien.no_identitas}`
//     }));
//   };

//   const get_id_klien = (email: string | null | undefined, state: AppState): string | null => {
//     if (!email) return null;  // Handle null/undefined case
//     if (!state.klienList) return null;
//     const client = state.klienList.find(klien => klien.email === email);
//     return client ? client.no_identitas : null;
//   };

//   const get_id_pegawai = (email: string | null | undefined, state: AppState): string | null => {
//     if (!email) return null;  // Handle null/undefined case
//     if (!state.userEmails) return null;
//     const staff = state.userEmails.find(member => member.email_user === email);
//     return staff ? staff.id : null;
//   };

// // Usage
//   const id_user = get_id_klien(session?.user.email, state) || get_id_pegawai(session?.user.email, state);

//   const getPetOptions = (clientId: string) => {
//     if (!clientId) return [];
    
//     return state.hewanList
//       // .filter((hewan: Hewan) => hewan.no_identitas_klien === clientId)
//       .map((hewan: Hewan) => ({
//         value: hewan.nama,
//         label: hewan.nama
//       }));
//   };

//   const fetchMedicalRecord = async (visitId: string, detail: {
//     nama_hewan: string;
//     no_identitas_klien: string;
//     no_front_desk: string;
//     no_perawat_hewan: string;
//     no_dokter_hewan: string;
//   }) => {
//     try {
//       setState(prev => ({ ...prev, isLoadingMedicalRecord: true }));

//       const res = await fetch(`/api/visits/${visitId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(detail)
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         setState(prev => ({
//           ...prev,
//           medicalRecords: {
//             ...prev.medicalRecords,
//             [visitId]: data.data
//           }
//         }));
//       }
//       return data.data;
//     } catch (error) {
//       console.error("Failed to fetch medical record:", error);
//       return null;
//     } finally {
//       setState(prev => ({ ...prev, isLoadingMedicalRecord: false }));
//     }
//   };

//   // Event Handlers
//   const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCreate = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   try {
//     const payload = {
//       clientId: form.clientId,
//       petName: form.petName,
//       visitType: form.visitType,
//       startTime: new Date(form.startTime).toISOString(),
//       endTime: new Date(form.endTime).toISOString(),
//       frontDeskId: form.frontDeskId,
//       nurseId: form.nurseId,
//       doctorId: form.doctorId
//     };

//     const response = await fetch('/api/visits/get-or-post-visit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     const data = await response.json();
    
//     if (data.success) {
//       setState(prev => ({
//         ...prev,
//         visits: [...prev.visits, {
//           ...data.data,
//         }]
//       }));
      
//       closeModal('create');
//       resetForm();
//       setError(null);
//       // update state lain dan tutup modal
//     } else {
//       // langsung set error biar muncul
//       setError(data.message || 'Terjadi kesalahan');
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'Terjadi kesalahan saat memproses permintaan';
    
//     setState(prev => ({ ...prev, error: errorMessage }));
//   }
// };

//   const handleUpdate = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!currentVisit.kunjungan) return;
  
//   try {
//     // Format payload dengan DateTime yang benar
//     const payload = {
//       id: currentVisit.kunjungan.id,
//       clientId: form.clientId,
//       petName: form.petName,
//       visitType: form.visitType,
//       startTime: new Date(form.startTime).toISOString(),
//       endTime: new Date(form.endTime).toISOString(),
//       frontDeskId: form.frontDeskId,
//       nurseId: form.nurseId,
//       doctorId: form.doctorId
//     };

//     const response = await fetch('/api/visits/get-or-post-visit', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Update state dengan data terbaru
//     const updatedVisits = state.visits.map(v => 
//       v.id === currentVisit.kunjungan?.id ? { 
//         ...v,
//         ...form,
//         startTime: data.data.startTime || data.data.timestamp_awal,
//         endTime: data.data.endTime || data.data.timestamp_akhir
//       } : v
//     );
    
//     setState(prev => ({ ...prev, visits: updatedVisits }));
//     closeModal('update');
//     resetForm();
//   } catch (error) {
//     const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'Terjadi kesalahan saat memproses permintaan';
    
//     setState(prev => ({ ...prev, error: errorMessage }));
//   }
// };
//   const handleDelete = async () => {
//   if (!currentVisit.idToDelete) return;

//   try {
//     const response = await fetch(`/api/visits/delete/${currentVisit.idToDelete}`, {
//       method: 'DELETE'
//     });

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(data.message || 'Failed to delete visit');
//     }

//     // Update state setelah delete berhasil
//     setState(prev => ({
//       ...prev,
//       visits: prev.visits.filter(v => v.id !== currentVisit.idToDelete)
//     }));

//     closeModal('delete');
//   } catch (error) {
//     console.error("Delete error:", error);
//     setState(prev => ({
//       ...prev,
//       error: error instanceof Error ? error.message : 'Failed to delete visit'
//     }));
//   }
// };

//   const handleShowMedicalRecord = async (kunjungan: Kunjungan) => {
//     setCurrentVisit(prev => ({ ...prev, kunjungan }));
    
//     await fetchMedicalRecord(kunjungan.id, {
//       nama_hewan: kunjungan.petName,
//       no_identitas_klien: kunjungan.clientId,
//       no_front_desk: kunjungan.frontDeskId,
//       no_perawat_hewan: kunjungan.nurseId,
//       no_dokter_hewan: kunjungan.doctorId
//     });

//     setModals(prev => ({ ...prev, showMedicalRecord: true }));
//     setCurrentVisit(prev => ({ ...prev, currentVisitId: kunjungan.id }));
//   };

//   // Helper functions untuk format tanggal/waktu
// const formatDateTime = (dateString: string) => {
//   if (!dateString) return '-';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
  
//   return date.toLocaleString('id-ID', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// const formatDateTimeForInput = (dateString: string) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
  
//   // Kompensasi timezone offset
//   const offset = date.getTimezoneOffset() * 60000;
//   const localISOTime = new Date(date.getTime() - offset).toISOString();
//   return localISOTime.slice(0, 16);
// };

//   const resetForm = () => {
//     setForm({
//       clientId: '',
//       petName: '',
//       visitType: 'Walk-In',
//       startTime: '',
//       endTime: '',
//       frontDeskId: '',
//       nurseId: '',
//       doctorId: ''
//     });
//   };

//   const openModal = (type: 'create' | 'update' | 'delete', kunjungan?: Kunjungan) => {
//   if (type === 'create') {
//     resetForm();
//     } else if (type === 'update' && kunjungan) {
//       setCurrentVisit(prev => ({ ...prev, kunjungan }));
//       setForm({
//         clientId: kunjungan.clientId,
//         petName: kunjungan.petName,
//         visitType: kunjungan.visitType,
//         startTime: formatDateTimeForInput(kunjungan.startTime), // Gunakan formatter
//         endTime: formatDateTimeForInput(kunjungan.endTime),     // Gunakan formatter
//         frontDeskId: kunjungan.frontDeskId,
//         nurseId: kunjungan.nurseId,
//         doctorId: kunjungan.doctorId
//       });
//     } else if (type === 'delete' && kunjungan) {
//          setCurrentVisit(prev => ({ 
//           ...prev, 
//           idToDelete: kunjungan.id,
//           kunjungan
//         }));
//           }
    
//     setModals(prev => ({ ...prev, [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: true }));
//   };

//   const closeModal = (type: 'create' | 'update' | 'delete' | 'medicalRecord') => {
//     setModals(prev => ({ ...prev, [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
//   };

//   const getStaffByRole = (role: StaffRole) => {
//     return state.userEmails.filter(user => user.role === role);
//   };

//   const StaffSelect = ({ role, value, onChange }: {
//     role: StaffRole;
//     value: string;
//     onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   }) => {
//     const { data: session } = useSession();
    
//     // Only run once when component mounts
//     useEffect(() => {
//       if (role === 'front_desk' && 
//           session?.user.role === 'front-desk' && 
//           value !== id_user) {
//         onChange({
//           target: {
//             name: 'frontDeskId',
//             value: id_user || ''
//           }
//         } as React.ChangeEvent<HTMLSelectElement>);
//       }
//   }, [role, session?.user.role, id_user]);

//     const isCurrentUserField = role === 'front_desk' && session?.user.role === 'front-desk';
//     const staffOptions = getStaffByRole(role);

//     return (
//       <div className="mb-4">
//         <label htmlFor={`${role}-select`} className="block text-sm font-medium text-gray-700 mb-1">
//           {role === 'front_desk' ? 'Front Desk' : role === 'dokter_hewan' ? 'Dokter' : 'Perawat'}
//         </label>
        
//         {isCurrentUserField ? (
//           // Display as read-only field for current front-desk user
//           <div className="p-2 bg-gray-100 rounded-md">
//             {session.user.email} (Current User)
//             <input 
//               type="hidden" 
//               name="frontDeskId" 
//               value={id_user || ''} 
//             />
//           </div>
//         ) : (
//           // Regular select dropdown for other cases
//           <select
//             id={`${role}-select`}
//             name={role === 'front_desk' ? 'frontDeskId' : 
//                   role === 'dokter_hewan' ? 'doctorId' : 'nurseId'}
//             value={isCurrentUserField ? id_user || '' : value}
//             onChange={onChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             required
//             disabled={state.loadingUsers || isCurrentUserField}
//           >
//             <option value="">
//               {state.loadingUsers ? 'Memuat...' : `Pilih ${role === 'front_desk' ? 'Front Desk' : role === 'dokter_hewan' ? 'Dokter' : 'Perawat'}`}
//             </option>
//             {staffOptions.map(user => (
//               <option key={user.id} value={user.id}>
//                 {user.email_user}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>
//     );
//   };


//   const VisitModal = ({ isCreate }: { isCreate: boolean }) => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-10">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">
//             {isCreate ? 'Buat Kunjungan Baru' : 'Edit Kunjungan'}
//           </h2>
//           <button 
//             onClick={() => closeModal(isCreate ? 'create' : 'update')}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FaTimes />
//           </button>
//         </div>

//          {error && (
//             <ErrorDisplay
//               error={error}
//               onClose={() => setError(null)}
//             />
//           )}

//         <form onSubmit={isCreate ? handleCreate : handleUpdate}>
//           {/* Client ID */}
//           <div className="mb-4">
//             <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
//               ID Klien
//             </label>
//             <select
//               id="clientId"
//               name="clientId"
//               value={form.clientId}
//               onChange={(e) => {
//                 handleFormChange(e);
//                 setForm(prev => ({ ...prev, petName: '' }));
//               }}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             >
//               <option value="">Pilih Klien</option>
//               {getClientOptions().map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Pet Name */}
//           <div className="mb-4">
//             <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
//               Nama Hewan
//             </label>
//             <select
//               id="petName"
//               name="petName"
//               value={form.petName}
//               onChange={handleFormChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//               disabled={!form.clientId}
//             >
//               <option value="">Pilih Hewan</option>
//               {form.clientId && getPetOptions(form.clientId).map(option => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Visit Type */}
//           <div className="mb-4">
//             <label htmlFor="visitType" className="block text-sm font-medium text-gray-700 mb-1">
//               Tipe Kunjungan
//             </label>
//             <select
//               id="visitType"
//               name="visitType"
//               value={form.visitType}
//               onChange={handleFormChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             >
//               {visitTypeOptions.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>

//           {/* Staff Selection */}
//           <StaffSelect role="front_desk" value={form.frontDeskId} onChange={handleFormChange} disabled={userRole === "front_desk"}/>
//           <StaffSelect role="perawat_hewan" value={form.nurseId} onChange={handleFormChange} />
//           <StaffSelect role="dokter_hewan" value={form.doctorId} onChange={handleFormChange} />
          

//           {/* Time Selection */}
//           <div className="mb-4">
//             <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
//               Waktu Mulai
//             </label>
//             <input
//               id="startTime"
//               type="datetime-local"
//               name="startTime"
//               value={formatDateTimeForInput(form.startTime)}
//               onChange={handleFormChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
//               Waktu Selesai
//             </label>
//             <input
//               id="endTime"
//               type="datetime-local"
//               name="endTime"
//               value={formatDateTimeForInput(form.endTime)}
//               onChange={handleFormChange}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => closeModal(isCreate ? 'create' : 'update')}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//             >
//               Batal
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               {isCreate ? 'Buat' : 'Update'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   const DeleteModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Hapus Kunjungan</h2>
//           <button 
//             onClick={() => closeModal('delete')}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         <div className="mb-6">
//           <p>Apakah kamu yakin untuk menghapus kunjungan ini?</p>
//           <p className="font-semibold mt-2">ID: {currentVisit.idToDelete}</p>
//         </div>

//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={() => closeModal('delete')}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//           >
//             Batal
//           </button>
//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//             disabled={state.loading}
//           >
//             {state.loading ? 'Menghapus...' : 'Hapus'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-cover bg-center px-4 py-10">
//       <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">List Kunjungan</h1>
//           {userRole==='front-desk' && <button
//             onClick={() => openModal('create')}
//             className="bg-[#FD7E14] hover:bg-[#E67112] text-white px-4 py-2 rounded-md"
//           >
//             + Buat Kunjungan Baru
//           </button>}
//         </div>

//         {state.loading ? (
//           <div className="flex justify-center items-center h-64">
//             <p>Memuat data...</p>
//           </div>
//         ) : state.error ? (
//           <div className="text-red-500 p-4">{state.error}</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Kunjungan</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Klien</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Mulai</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rekam Medis</th>
//                   {userRole === "front-desk" && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {state.visits.filter(visit => {
//                     if (userRole === "front-desk") return true;
                    
//                     // Jika doctor, tampilkan hanya kunjungan yang ditangani doctor ini
//                     if (userRole === "dokter-hewan") return visit.doctorId === id_user;

//                     if (userRole === "perawat-hewan") return visit.nurseId === id_user;
                    
//                     // Jika client, tampilkan hanya kunjungan milik client ini
//                     if (userRole === "individu" || userRole === "perusahaan" ) return visit.clientId === id_user;
                    
//                     return false;
//                   }).map((visit) => (
//                   <tr key={visit.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.id}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.clientId}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.petName}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         visit.visitType === 'Walk-In' ? 'bg-blue-100 text-blue-800' : 
//                         visit.visitType === 'Janji Temu' ? 'bg-green-100 text-green-800' : 
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {visit.visitType}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDateTime(visit.startTime)}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDateTime(visit.endTime)}</td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       <button 
//                         onClick={() => handleShowMedicalRecord(visit)}
//                         className="text-blue-600 hover:text-blue-800 inline-flex items-center"
//                       >
//                         <FaFileMedical className="mr-1" />
//                         <span>Rekam</span>
//                       </button>
//                     </td>
//                     {userRole === "front-desk" && (
//                       <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
//                         <button 
//                           onClick={() => openModal('update', visit)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button 
//                           onClick={() => openModal('delete', visit)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <FaTrash />
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Modals */}
//         {modals.showCreate && <VisitModal isCreate={true} />}
//         {modals.showUpdate && <VisitModal isCreate={false} />}
//         {modals.showDelete && <DeleteModal />}
//         {modals.showMedicalRecord && currentVisit.kunjungan && (
//           <RekamMedisModal
//             isOpen={modals.showMedicalRecord}
//             onClose={() => closeModal('medicalRecord')}
//             onSubmit={(data) => {
//               setState(prev => ({
//                 ...prev,
//                 medicalRecords: {
//                   ...prev.medicalRecords,
//                   [currentVisit.currentVisitId]: data
//                 }
//               }));
//               closeModal('medicalRecord');
//             }}
//             existingData={state.medicalRecords[currentVisit.currentVisitId]}
//             isLoading={state.isLoadingMedicalRecord}
//             id={currentVisit.kunjungan.id}
//             petName={currentVisit.kunjungan.petName}
//             clientId={currentVisit.kunjungan.clientId}
//             doctorId={currentVisit.kunjungan.doctorId}
//             nurseId={currentVisit.kunjungan.nurseId}
//             frontDeskId={currentVisit.kunjungan.frontDeskId}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import { FaPlus, FaFileMedical, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import RekamMedisModal from './components/RekamMedisModal';
import { ErrorDisplay } from './components/ErrorDisplay'; // Import the ErrorDisplay component

type VisitType = 'Walk-In' | 'Janji Temu' | 'Darurat';
export type StaffRole = 'front_desk' | 'dokter_hewan' | 'perawat_hewan';

interface Kunjungan {
  id: string;
  clientId: string;
  petName: string;
  petType: string;
  visitType: VisitType;
  startTime: string;
  endTime: string;
  frontDeskId: string;
  nurseId: string;
  doctorId: string;
}

export interface RekamMedis {
  bodyTemperature: number;
  bodyWeight: number;
  catatan: string;
}

export interface StaffMember {
  id: string;
  email_user: string;
  role: StaffRole;
}

export interface Klien {
  no_identitas: string;
  email: string;
  tanggal_registrasi: string;
}

interface Hewan {
  nama: string;
  no_identitas_klien: string;
  tanggal_lahir: string;
  id_jenis: string;
  url_foto: string;
}

interface AppState {
  visits: Kunjungan[];
  medicalRecords: Record<string, RekamMedis>;
  userEmails: StaffMember[];
  klienList: Klien[];
  hewanList: Hewan[];
  loading: boolean;
  loadingUsers: boolean;
  isLoadingMedicalRecord: boolean;
  error: string | null;
}

export default function VisitPage() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // State management
  const [state, setState] = useState<AppState>({
    visits: [],
    medicalRecords: {},
    userEmails: [],
    klienList: [],
    hewanList: [],
    loading: true,
    loadingUsers: false,
    isLoadingMedicalRecord: false,
    error: null
  });

  const [modals, setModals] = useState({
    showCreate: false,
    showUpdate: false,
    showDelete: false,
    showMedicalRecord: false
  });

  const [form, setForm] = useState<Omit<Kunjungan, 'id' | 'petType'>>({
    clientId: '',
    petName: '',
    visitType: 'Walk-In',
    startTime: '',
    endTime: '',
    frontDeskId: '',
    nurseId: '',
    doctorId: ''
  });

  const [currentVisit, setCurrentVisit] = useState({
    kunjungan: null as Kunjungan | null,
    idToDelete: '',
    currentVisitId: ''
  });

  const visitTypeOptions: VisitType[] = ['Walk-In', 'Janji Temu', 'Darurat'];

  // Data Fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        const [visitsResponse, staffResponse, klienResponse, hewanResponse] = await Promise.all([
          fetch('/api/visits/get-or-post-visit'),
          fetch('/api/visits/get_staff'),
          fetch('/api/visits/get-client'),
          fetch('/api/visits/get-pet')
        ]);

        if (!visitsResponse.ok || !staffResponse.ok || !klienResponse.ok || !hewanResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }

        const [visitsData, staffData, klienData, hewanData] = await Promise.all([
          visitsResponse.json(),
          staffResponse.json(),
          klienResponse.json(),
          hewanResponse.json()
        ]);

        setState(prev => ({
          ...prev,
          visits: visitsData.data,
          userEmails: staffData.data,
          klienList: klienData.data,
          hewanList: hewanData.data,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false
        }));
      }
    };

    fetchInitialData();
  }, []);

  const [error, setError] = useState<string | null>(null);

  const getClientOptions = () => {
    return state.klienList.map((klien: Klien) => ({
      value: klien.no_identitas,
      label: `${klien.no_identitas}`
    }));
  };

  const get_id_klien = (email: string | null | undefined, state: AppState): string | null => {
    if (!email) return null;
    if (!state.klienList) return null;
    const client = state.klienList.find(klien => klien.email === email);
    return client ? client.no_identitas : null;
  };

  const get_id_pegawai = (email: string | null | undefined, state: AppState): string | null => {
    if (!email) return null;
    if (!state.userEmails) return null;
    const staff = state.userEmails.find(member => member.email_user === email);
    return staff ? staff.id : null;
  };

  const id_user = get_id_klien(session?.user.email, state) || get_id_pegawai(session?.user.email, state);

  const getPetOptions = (clientId: string) => {
    if (!clientId) return [];
    
    return state.hewanList
      .map((hewan: Hewan) => ({
        value: hewan.nama,
        label: hewan.nama
      }));
  };

  const fetchMedicalRecord = async (visitId: string, detail: {
    nama_hewan: string;
    no_identitas_klien: string;
    no_front_desk: string;
    no_perawat_hewan: string;
    no_dokter_hewan: string;
  }) => {
    try {
      setState(prev => ({ ...prev, isLoadingMedicalRecord: true }));

      const res = await fetch(`/api/visits/${visitId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detail)
      });

      const data = await res.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          medicalRecords: {
            ...prev.medicalRecords,
            [visitId]: data.data
          }
        }));
      }
      return data.data;
    } catch (error) {
      console.error("Failed to fetch medical record:", error);
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoadingMedicalRecord: false }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        clientId: form.clientId,
        petName: form.petName,
        visitType: form.visitType,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        frontDeskId: form.frontDeskId,
        nurseId: form.nurseId,
        doctorId: form.doctorId
      };

      const response = await fetch('/api/visits/get-or-post-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          visits: [...prev.visits, {
            ...data.data,
          }]
        }));
        
        closeModal('create');
        resetForm();
        setError(null);
      } else {
        setError(data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat memproses permintaan';
      
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVisit.kunjungan) return;
    
    try {
      const payload = {
        id: currentVisit.kunjungan.id,
        clientId: form.clientId,
        petName: form.petName,
        visitType: form.visitType,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        frontDeskId: form.frontDeskId,
        nurseId: form.nurseId,
        doctorId: form.doctorId
      };

      const response = await fetch('/api/visits/get-or-post-visit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const updatedVisits = state.visits.map(v => 
        v.id === currentVisit.kunjungan?.id ? { 
          ...v,
          ...form,
          startTime: data.data.startTime || data.data.timestamp_awal,
          endTime: data.data.endTime || data.data.timestamp_akhir
        } : v
      );
      
      setState(prev => ({ ...prev, visits: updatedVisits }));
      closeModal('update');
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Terjadi kesalahan saat memproses permintaan';
      
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  };

  const handleDelete = async () => {
    if (!currentVisit.idToDelete) return;

    try {
      const response = await fetch(`/api/visits/delete/${currentVisit.idToDelete}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete visit');
      }

      setState(prev => ({
        ...prev,
        visits: prev.visits.filter(v => v.id !== currentVisit.idToDelete)
      }));

      closeModal('delete');
    } catch (error) {
      console.error("Delete error:", error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete visit'
      }));
    }
  };

  const handleShowMedicalRecord = async (kunjungan: Kunjungan) => {
    setCurrentVisit(prev => ({ ...prev, kunjungan }));
    
    await fetchMedicalRecord(kunjungan.id, {
      nama_hewan: kunjungan.petName,
      no_identitas_klien: kunjungan.clientId,
      no_front_desk: kunjungan.frontDeskId,
      no_perawat_hewan: kunjungan.nurseId,
      no_dokter_hewan: kunjungan.doctorId
    });

    setModals(prev => ({ ...prev, showMedicalRecord: true }));
    setCurrentVisit(prev => ({ ...prev, currentVisitId: kunjungan.id }));
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString();
    return localISOTime.slice(0, 16);
  };

  const resetForm = () => {
    setForm({
      clientId: '',
      petName: '',
      visitType: 'Walk-In',
      startTime: '',
      endTime: '',
      frontDeskId: '',
      nurseId: '',
      doctorId: ''
    });
  };

  const openModal = (type: 'create' | 'update' | 'delete', kunjungan?: Kunjungan) => {
    if (type === 'create') {
      resetForm();
    } else if (type === 'update' && kunjungan) {
      setCurrentVisit(prev => ({ ...prev, kunjungan }));
      setForm({
        clientId: kunjungan.clientId,
        petName: kunjungan.petName,
        visitType: kunjungan.visitType,
        startTime: formatDateTimeForInput(kunjungan.startTime),
        endTime: formatDateTimeForInput(kunjungan.endTime),
        frontDeskId: kunjungan.frontDeskId,
        nurseId: kunjungan.nurseId,
        doctorId: kunjungan.doctorId
      });
    } else if (type === 'delete' && kunjungan) {
      setCurrentVisit(prev => ({ 
        ...prev, 
        idToDelete: kunjungan.id,
        kunjungan
      }));
    }
    
    setModals(prev => ({ ...prev, [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: true }));
  };

  const closeModal = (type: 'create' | 'update' | 'delete' | 'medicalRecord') => {
    setModals(prev => ({ ...prev, [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
  };

  const getStaffByRole = (role: StaffRole) => {
    return state.userEmails.filter(user => user.role === role);
  };

  const StaffSelect = ({ role, value, onChange }: {
    role: StaffRole;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => {
    const { data: session } = useSession();
    
    useEffect(() => {
      if (role === 'front_desk' && 
          session?.user.role === 'front-desk' && 
          value !== id_user) {
        onChange({
          target: {
            name: 'frontDeskId',
            value: id_user || ''
          }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    }, [role, session?.user.role, id_user]);

    const isCurrentUserField = role === 'front_desk' && session?.user.role === 'front-desk';
    const staffOptions = getStaffByRole(role);

    return (
      <div className="mb-4">
        <label htmlFor={`${role}-select`} className="block text-sm font-medium text-gray-700 mb-1">
          {role === 'front_desk' ? 'Front Desk' : role === 'dokter_hewan' ? 'Dokter' : 'Perawat'}
        </label>
        
        {isCurrentUserField ? (
          <div className="p-2 bg-gray-100 rounded-md">
            {session.user.email} (Current User)
            <input 
              type="hidden" 
              name="frontDeskId" 
              value={id_user || ''} 
            />
          </div>
        ) : (
          <select
            id={`${role}-select`}
            name={role === 'front_desk' ? 'frontDeskId' : 
                  role === 'dokter_hewan' ? 'doctorId' : 'nurseId'}
            value={isCurrentUserField ? id_user || '' : value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={state.loadingUsers || isCurrentUserField}
          >
            <option value="">
              {state.loadingUsers ? 'Memuat...' : `Pilih ${role === 'front_desk' ? 'Front Desk' : role === 'dokter_hewan' ? 'Dokter' : 'Perawat'}`}
            </option>
            {staffOptions.map(user => (
              <option key={user.id} value={user.id}>
                {user.email_user}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  const VisitModal = ({ isCreate }: { isCreate: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isCreate ? 'Buat Kunjungan Baru' : 'Edit Kunjungan'}
          </h2>
          <button 
            onClick={() => closeModal(isCreate ? 'create' : 'update')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <ErrorDisplay
            error={error}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={isCreate ? handleCreate : handleUpdate}>
          <div className="mb-4">
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
              ID Klien
            </label>
            <select
              id="clientId"
              name="clientId"
              value={form.clientId}
              onChange={(e) => {
                handleFormChange(e);
                setForm(prev => ({ ...prev, petName: '' }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih Klien</option>
              {getClientOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Hewan
            </label>
            <select
              id="petName"
              name="petName"
              value={form.petName}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!form.clientId}
            >
              <option value="">Pilih Hewan</option>
              {form.clientId && getPetOptions(form.clientId).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="visitType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Kunjungan
            </label>
            <select
              id="visitType"
              name="visitType"
              value={form.visitType}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              {visitTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <StaffSelect role="front_desk" value={form.frontDeskId} onChange={handleFormChange} />
          <StaffSelect role="perawat_hewan" value={form.nurseId} onChange={handleFormChange} />
          <StaffSelect role="dokter_hewan" value={form.doctorId} onChange={handleFormChange} />

          <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Mulai
            </label>
            <input
              id="startTime"
              type="datetime-local"
              name="startTime"
              value={formatDateTimeForInput(form.startTime)}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Selesai
            </label>
            <input
              id="endTime"
              type="datetime-local"
              name="endTime"
              value={formatDateTimeForInput(form.endTime)}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => closeModal(isCreate ? 'create' : 'update')}
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
          <button 
            onClick={() => closeModal('delete')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <p>Apakah kamu yakin untuk menghapus kunjungan ini?</p>
          <p className="font-semibold mt-2">ID: {currentVisit.idToDelete}</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => closeModal('delete')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={state.loading}
          >
            {state.loading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center px-4 py-10">
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List Kunjungan</h1>
          {userRole === 'front-desk' && (
            <button
              onClick={() => openModal('create')}
              className="bg-[#FD7E14] hover:bg-[#E67112] text-white px-4 py-2 rounded-md"
            >
              + Buat Kunjungan Baru
            </button>
          )}
        </div>

        {state.loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Memuat data...</p>
          </div>
        ) : state.error ? (
          <ErrorDisplay
            error={state.error}
            onClose={() => setState(prev => ({ ...prev, error: null }))}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Kunjungan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Klien</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Hewan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Mulai</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rekam Medis</th>
                  {userRole === "front-desk" && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {state.visits.filter(visit => {
                  if (userRole === "front-desk") return true;
                  if (userRole === "dokter-hewan") return visit.doctorId === id_user;
                  if (userRole === "perawat-hewan") return visit.nurseId === id_user;
                  if (userRole === "individu" || userRole === "perusahaan") return visit.clientId === id_user;
                  return false;
                }).map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.clientId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{visit.petName}</td>
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
                        onClick={() => handleShowMedicalRecord(visit)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <FaFileMedical className="mr-1" />
                        <span>Rekam</span>
                      </button>
                    </td>
                    {userRole === "front-desk" && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                        <button 
                          onClick={() => openModal('update', visit)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => openModal('delete', visit)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modals.showCreate && <VisitModal isCreate={true} />}
        {modals.showUpdate && <VisitModal isCreate={false} />}
        {modals.showDelete && <DeleteModal />}
        {modals.showMedicalRecord && currentVisit.kunjungan && (
          <RekamMedisModal
            isOpen={modals.showMedicalRecord}
            onClose={() => closeModal('medicalRecord')}
            onSubmit={(data) => {
              setState(prev => ({
                ...prev,
                medicalRecords: {
                  ...prev.medicalRecords,
                  [currentVisit.currentVisitId]: data
                }
              }));
              closeModal('medicalRecord');
            }}
            existingData={state.medicalRecords[currentVisit.currentVisitId]}
            isLoading={state.isLoadingMedicalRecord}
            id={currentVisit.kunjungan.id}
            petName={currentVisit.kunjungan.petName}
            clientId={currentVisit.kunjungan.clientId}
            doctorId={currentVisit.kunjungan.doctorId}
            nurseId={currentVisit.kunjungan.nurseId}
            frontDeskId={currentVisit.kunjungan.frontDeskId}
          />
        )}
      </div>
    </div>
  );
}