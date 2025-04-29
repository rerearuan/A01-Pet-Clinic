'use client';
import { useState } from 'react';

// Custom icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

type ChevronDownIconProps = {
    className?: string;
  };
  
  const ChevronDownIcon = ({ className = '' }: ChevronDownIconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
  

type Vaccination = {
  id: number;
  kunjungan: string;
  tanggalKunjungan: string;
  vaksin: string;
};

const dummyVaccinations: Vaccination[] = [
  { id: 1, kunjungan: 'KJN001', tanggalKunjungan: 'Rabu, 5 Februari 2025', vaksin: 'VAC001 - Feline Panleukopenia' },
  { id: 2, kunjungan: 'KJN002', tanggalKunjungan: 'Jumat, 21 Februari 2025', vaksin: 'VAC002 - Canine Parvovirus' },
  { id: 3, kunjungan: 'KJN003', tanggalKunjungan: 'Selasa, 15 Maret 2025', vaksin: 'VAC003 - Canine Adenovirus' },
];

// Sample data for dropdowns
const kunjunganOptions = [
  { value: 'KJN001', label: 'KJN001' },
  { value: 'KJN002', label: 'KJN002' },
  { value: 'KJN003', label: 'KJN003' },
  { value: 'KJN004', label: 'KJN004' },
  { value: 'KJN005', label: 'KJN005' },
];

const vaksinOptions = [
  { value: 'VAC001', label: 'VAC001 - Feline Panleukopenia' },
  { value: 'VAC002', label: 'VAC002 - Canine Parvovirus' },
  { value: 'VAC003', label: 'VAC003 - Canine Adenovirus' },
  { value: 'VAC004', label: 'VAC004 - Rabies' },
  { value: 'VAC005', label: 'VAC005 - Feline Leukemia' },
];

export default function VaccinationPage() {
  const [vaccinations] = useState(dummyVaccinations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);

  const handleEditClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">List Vaccination</h1>

          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-md"
            >
              <PlusIcon />
              <span>Create New Vaccination</span>
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-50">
            <div className="py-4 text-center text-sm font-bold text-gray-800">No</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Kunjungan</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Tanggal Kunjungan</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Vaksin</div>
            <div className="py-4 text-center text-sm font-bold text-gray-800">Action</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {vaccinations.map((vaksin, index) => (
            <div 
              key={vaksin.id} 
              className="grid grid-cols-5 items-center border-b last:border-b-0 border-gray-100 hover:bg-gray-50"
            >
              <div className="py-4 text-sm text-gray-700 text-center">{index + 1}</div>
              <div className="py-4 text-sm text-gray-700 text-center">{vaksin.kunjungan}</div>
              <div className="py-4 text-sm text-gray-700 text-center">{vaksin.tanggalKunjungan}</div>
              <div className="py-4 text-sm text-gray-700 text-center">{vaksin.vaksin}</div>
              <div className="py-4 text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEditClick(vaksin)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(vaksin)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        {showCreateModal && <CreateVaccinationModal onClose={() => setShowCreateModal(false)} />}
        {showUpdateModal && selectedVaccination && (
          <UpdateVaccinationModal 
            vaccination={selectedVaccination}
            onClose={() => setShowUpdateModal(false)} 
          />
        )}
        {showDeleteModal && selectedVaccination && (
          <DeleteVaccinationModal 
            vaccination={selectedVaccination}
            onClose={() => setShowDeleteModal(false)} 
          />
        )}
      </main>
    </div>
  );
}

// ================= Modal Components =================

type ModalProps = {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  primaryActionLabel: string;
  primaryActionColor: string;
  showHeader?: boolean;
};

function Modal({ 
  onClose, 
  title, 
  children, 
  primaryActionLabel, 
  primaryActionColor,
  showHeader = true
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        {showHeader && title && (
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        )}
        <div>{children}</div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            className={`${primaryActionColor} text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition`}
          >
            {primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom Dropdown component
function Dropdown({ 
  label, 
  options, 
  placeholder, 
  disabled = false 
}: { 
  label: string; 
  options: {value: string; label: string}[]; 
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  return (
    <div className="relative">
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <div 
        className={`flex justify-between items-center w-full border ${disabled ? 'bg-gray-100' : 'bg-white'} border-gray-300 rounded-lg px-4 py-2 cursor-pointer`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selected ? 'text-gray-800 font-medium' : 'text-gray-500'}>
          {selected || placeholder}
        </span>
        {!disabled && <ChevronDownIcon className="text-orange-500" />}
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div 
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              onClick={() => {
                setSelected(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateVaccinationModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="Create Vaccination" primaryActionLabel="Create" primaryActionColor="bg-orange-500">
      <div className="space-y-4">
        <Dropdown 
          label="Kunjungan" 
          options={kunjunganOptions} 
          placeholder="Pilih Kunjungan"
        />
        <Dropdown 
          label="Vaksin" 
          options={vaksinOptions} 
          placeholder="Pilih Vaksin"
        />
      </div>
    </Modal>
  );
}

function UpdateVaccinationModal({ onClose, vaccination }: { onClose: () => void; vaccination: Vaccination }) {
  return (
    <Modal onClose={onClose} title="Update Vaccination" primaryActionLabel="Update" primaryActionColor="bg-orange-500">
      <div className="space-y-4">
        <Dropdown 
          label="Kunjungan" 
          options={kunjunganOptions}
          placeholder={vaccination.kunjungan}
          disabled={true}
        />
        <Dropdown 
          label="Vaksin" 
          options={vaksinOptions}
          placeholder="Pilih Vaksin" 
        />
      </div>
    </Modal>
  );
}

function DeleteVaccinationModal({ onClose, vaccination }: { onClose: () => void; vaccination: Vaccination }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-orange-500 text-center">Delete Vaccination</h2>
          
          <div className="text-center space-y-1">
            <p className="text-black font-medium">Apakah kamu yakin untuk menghapus vaksinasi</p>
            <p className="text-black font-bold">untuk kunjungan <span className="text-orange-500">{vaccination.kunjungan}</span> dengan Vaksin </p>
            <p className="text-black font-bold"><span className="text-orange-500">{vaccination.vaksin}</span> ?</p>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-white border border-gray-300 text-gray-700 font-semibold px-8 py-2 rounded-lg hover:bg-gray-100 transition min-w-32"
            >
              Cancel
            </button>
            <button
              className="bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:opacity-90 transition min-w-32"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}