'use client';
import { useEffect, useState } from 'react';

type Vaccination = {
  id: string;
  kunjungan: string;
  tanggalKunjungan: string;
  vaksin: string;
};

type Option = {
  value: string;
  label: string;
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [kunjunganOptions, setKunjunganOptions] = useState<Option[]>([]);
  const [vaksinOptions, setVaksinOptions] = useState<Option[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchVaccinations();
    fetchDropdowns();
  }, []);

  const fetchVaccinations = async () => {
    setLoading(true);
    const res = await fetch('/api/vaksin');
    const data = await res.json();
    const filtered = data
      .filter((item: any) => item.vaksin !== null)
      .sort((a: any, b: any) => new Date(a.tanggal_kunjungan).getTime() - new Date(b.tanggal_kunjungan).getTime());

    setVaccinations(filtered.map((item: any) => ({
      id: item.id_kunjungan,
      kunjungan: item.id_kunjungan,
      tanggalKunjungan: item.tanggal_kunjungan,
      vaksin: item.vaksin,
    })));
    setLoading(false);
  };

  const fetchDropdowns = async () => {
    const [resKunjungan, resVaksin] = await Promise.all([
      fetch('/api/kunjungan/open'),
      fetch('/api/vaksin/stok'),
    ]);
    const kunjungan = await resKunjungan.json();
    const vaksin = await resVaksin.json();
    setKunjunganOptions(kunjungan.map((k: any) => ({
      value: k.id_kunjungan,
      label: k.id_kunjungan,
    })));
    setVaksinOptions(vaksin.map((v: any) => ({
      value: v.kode,
      label: `${v.kode} - ${v.nama} [${v.stok}]`,
    })));
  };

  const handleEditClick = (vacc: Vaccination) => {
    setSelectedVaccination(vacc);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (vacc: Vaccination) => {
    setSelectedVaccination(vacc);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {errorMessage && <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />}
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

        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-50">
            <HeaderCell>NO</HeaderCell>
            <HeaderCell>KUNJUNGAN</HeaderCell>
            <HeaderCell>TANGGAL</HeaderCell>
            <HeaderCell>VAKSIN</HeaderCell>
            <HeaderCell>ACTION</HeaderCell>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-6 text-center text-gray-500">Loading...</div>
          ) : vaccinations.length === 0 ? (
            <div className="py-6 text-center text-gray-500">Belum ada data vaksinasi</div>
          ) : (
            vaccinations.map((vaksin, index) => (
              <div key={vaksin.id} className="grid grid-cols-5 items-center border-b last:border-b-0 border-gray-100 hover:bg-orange-50">
                <Cell>{index + 1}</Cell>
                <Cell>{vaksin.kunjungan}</Cell>
                <Cell>{vaksin.tanggalKunjungan}</Cell>
                <Cell>{vaksin.vaksin}</Cell>
                <div className="py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEditClick(vaksin)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><EditIcon /></button>
                    <button onClick={() => handleDeleteClick(vaksin)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showCreateModal && (
          <VaccinationModal
            isUpdate={false}
            onClose={() => setShowCreateModal(false)}
            onSuccess={fetchVaccinations}
            kunjunganOptions={kunjunganOptions}
            vaksinOptions={vaksinOptions}
            setErrorMessage={setErrorMessage}
          />
        )}
        {showUpdateModal && selectedVaccination && (
          <VaccinationModal
            isUpdate={true}
            vaccination={selectedVaccination}
            onClose={() => setShowUpdateModal(false)}
            onSuccess={fetchVaccinations}
            vaksinOptions={vaksinOptions}
            setErrorMessage={setErrorMessage}
          />
        )}
        {showDeleteModal && selectedVaccination && (
          <DeleteModal
            vaccination={selectedVaccination}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={fetchVaccinations}
          />
        )}
      </main>
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <div className="py-4 text-sm text-gray-700 text-center">{children}</div>;
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <div className="py-4 text-center text-sm font-bold text-gray-800">{children}</div>;
}

function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4 z-[1000]">
        <h2 className="text-xl font-semibold text-red-600">Terjadi Kesalahan</h2>
        <p className="text-gray-800 whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}


// === VaccinationModal ===
function VaccinationModal({
  onClose,
  onSuccess,
  vaccination,
  isUpdate = false,
  kunjunganOptions = [],
  vaksinOptions,
  setErrorMessage,
}: {
  onClose: () => void;
  onSuccess: () => void;
  vaccination?: Vaccination;
  isUpdate: boolean;
  kunjunganOptions?: Option[];
  vaksinOptions: Option[];
  setErrorMessage: (msg: string) => void;
}) {
  const [selectedKunjungan, setKunjungan] = useState(vaccination?.id || '');
  const [selectedVaksin, setVaksin] = useState('');

  useEffect(() => {
    if (isUpdate && vaccination) {
      const match = vaksinOptions.find((opt) =>
        vaccination.vaksin && opt.label.includes(vaccination.vaksin)
      );
      if (match) setVaksin(match.value);
    }
  }, [isUpdate, vaccination, vaksinOptions]);

  const handleSubmit = async () => {
    if (!selectedKunjungan || !selectedVaksin) {
      setErrorMessage('Kunjungan dan vaksin wajib dipilih!');
      return;
    }

    const label = vaksinOptions.find(v => v.value === selectedVaksin)?.label || '';
    const stokMatch = label.match(/\[(\d+)\]/);
    // if (stokMatch && parseInt(stokMatch[1]) === 0) {
    //   setErrorMessage('Stok Vaksin yang dipilih sudah habis');
    //   return;
    // }

    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate ? '/api/vaksin/update' : '/api/vaksin/create';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_kunjungan: selectedKunjungan,
          kode_vaksin: selectedVaksin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || 'Gagal melakukan request ke server.');
        return;
      }
      onSuccess();
      onClose();
    } catch (error) {
      setErrorMessage('Terjadi kesalahan jaringan atau internal server.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isUpdate ? 'Update' : 'Create'} Vaccination
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Kunjungan</label>
            {isUpdate ? (
              <input
                type="text"
                value={selectedKunjungan}
                disabled
                className="w-full bg-gray-200 cursor-not-allowed border border-gray-300 px-3 py-2 rounded-lg"
              />
            ) : (
              <select
                value={selectedKunjungan}
                onChange={(e) => setKunjungan(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              >
                <option value="">Pilih kunjungan</option>
                {kunjunganOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vaksin</label>
            <select
              value={selectedVaksin}
              onChange={(e) => setVaksin(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            >
              <option value="">Pilih vaksin</option>
              {vaksinOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit} className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90">
            {isUpdate ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// === DeleteModal ===
function DeleteModal({ onClose, onSuccess, vaccination }: { onClose: () => void; onSuccess: () => void; vaccination: Vaccination }) {
  const handleDelete = async () => {
    const res = await fetch('/api/vaksin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_kunjungan: vaccination.id }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Gagal hapus');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-orange-500 text-center">Delete Vaccination</h2>
        <div className="text-center text-black">
          <p className="font-medium">Apakah kamu yakin untuk menghapus vaksinasi</p>
          <p className="font-bold">untuk kunjungan <span className="text-orange-500">{vaccination.kunjungan}</span>?</p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-semibold px-8 py-2 rounded-lg hover:bg-gray-100 transition min-w-32">Cancel</button>
          <button onClick={handleDelete} className="bg-orange-500 text-white font-semibold px-8 py-2 rounded-lg hover:opacity-90 transition min-w-32">Delete</button>
        </div>
      </div>
    </div>
  );
}
