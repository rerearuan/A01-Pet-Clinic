'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Certificate {
  nomorSertifikat: string;
  namaSertifikat: string;
}

interface Schedule {
  hari: string;
  jam: string;
}

interface UserData {
  email?: string;
  tanggal_registrasi?: string;
  tanggal_mulai_kerja?: string;
  tanggal_akhir_kerja?: string;
  alamat?: string;
  nomor_telepon?: string;
  nama_depan?: string;
  nama_tengah?: string;
  nama_belakang?: string;
  nama_perusahaan?: string;
  sertifikat?: Certificate[];
  jadwalPraktik?: Schedule[];
}

interface UpdateProfileModalProps {
  onClose: () => void;
  userData: UserData;
  userRole: string;
}

export default function UpdateProfileModal({ onClose, userData, userRole }: UpdateProfileModalProps) {
  const [formData, setFormData] = useState<UserData>({
    email: '',
    tanggal_registrasi: '',
    tanggal_mulai_kerja: '',
    tanggal_akhir_kerja: '',
    alamat: '',
    nomor_telepon: '',
    nama_depan: '',
    nama_tengah: '',
    nama_belakang: '',
    nama_perusahaan: '',
    sertifikat: [],
    jadwalPraktik: [],
  });

  const [newSertifikat, setNewSertifikat] = useState({ nomorSertifikat: '', namaSertifikat: '' });
  const [newJadwal, setNewJadwal] = useState({ hari: 'Senin', jam: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Initialize form data from userData when it's available
  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || '',
        tanggal_registrasi: userData.tanggal_registrasi || '',
        tanggal_mulai_kerja: userData.tanggal_mulai_kerja || '',
        tanggal_akhir_kerja: userData.tanggal_akhir_kerja || '',
        alamat: userData.alamat || '',
        nomor_telepon: userData.nomor_telepon || '',
        nama_depan: userData.nama_depan || '',
        nama_tengah: userData.nama_tengah || '',
        nama_belakang: userData.nama_belakang || '',
        nama_perusahaan: userData.nama_perusahaan || '',
        sertifikat: userData.sertifikat || [],
        jadwalPraktik: userData.jadwalPraktik || [],
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSertifikatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSertifikat((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleJadwalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewJadwal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addSertifikat = () => {
    if (!newSertifikat.nomorSertifikat || !newSertifikat.namaSertifikat) {
      toast.error('Nomor dan nama sertifikat harus diisi');
      return;
    }

    const isDuplicate = formData.sertifikat?.some(
      (cert) => cert.nomorSertifikat === newSertifikat.nomorSertifikat
    );

    if (isDuplicate) {
      toast.error('Nomor sertifikat sudah ada');
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      sertifikat: [...(prevState.sertifikat || []), { ...newSertifikat }],
    }));

    setNewSertifikat({ nomorSertifikat: '', namaSertifikat: '' });
  };

  const removeSertifikat = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      sertifikat: prevState.sertifikat?.filter((_, i) => i !== index) || [],
    }));
  };

  const addJadwal = () => {
    if (!newJadwal.jam) {
      toast.error('Jam praktik harus diisi');
      return;
    }

    const jamRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!jamRegex.test(newJadwal.jam)) {
      toast.error('Format jam tidak valid. Gunakan format HH:MM-HH:MM');
      return;
    }

    const isDuplicate = formData.jadwalPraktik?.some(
      (jadwal) => jadwal.hari === newJadwal.hari && jadwal.jam === newJadwal.jam
    );

    if (isDuplicate) {
      toast.error('Jadwal untuk hari dan jam tersebut sudah ada');
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      jadwalPraktik: [...(prevState.jadwalPraktik || []), { ...newJadwal }],
    }));

    setNewJadwal({ hari: 'Senin', jam: '' });
  };

  const removeJadwal = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      jadwalPraktik: prevState.jadwalPraktik?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = () => {
    if (!formData.alamat) {
      toast.error('Alamat harus diisi');
      return false;
    }

    if (!formData.nomor_telepon) {
      toast.error('Nomor telepon harus diisi');
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.nomor_telepon.replace(/\D/g, ''))) {
      toast.error('Format nomor telepon tidak valid');
      return false;
    }

    if (userRole === 'individu') {
      if (!formData.nama_depan || !formData.nama_belakang) {
        toast.error('Nama depan dan nama belakang harus diisi');
        return false;
      }
    }

    if (userRole === 'perusahaan') {
      if (!formData.nama_perusahaan) {
        toast.error('Nama perusahaan harus diisi');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal memperbarui profil');
      }

      toast.success('Profil berhasil diperbarui');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui profil');
      toast.error(err.message || 'Terjadi kesalahan saat memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">Perbarui Profil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomor_telepon"
                  value={formData.nomor_telepon}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              {(userRole === 'individu' || userRole === 'perusahaan') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Registrasi
                  </label>
                  <input
                    type="text"
                    value={formatDate(formData.tanggal_registrasi)}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                    disabled
                  />
                </div>
              )}
              {(userRole === 'front-desk' || userRole === 'dokter-hewan' || userRole === 'perawat-hewan') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai Kerja
                    </label>
                    <input
                      type="date"
                      name="tanggal_mulai_kerja"
                      value={formData.tanggal_mulai_kerja}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Akhir Kerja
                    </label>
                    <input
                      type="date"
                      name="tanggal_akhir_kerja"
                      value={formData.tanggal_akhir_kerja}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Individu-specific section */}
          {userRole === 'individu' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Pribadi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Depan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_depan"
                    value={formData.nama_depan}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Tengah
                  </label>
                  <input
                    type="text"
                    name="nama_tengah"
                    value={formData.nama_tengah}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Belakang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_belakang"
                    value={formData.nama_belakang}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Perusahaan-specific section */}
          {userRole === 'perusahaan' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Perusahaan</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_perusahaan"
                  value={formData.nama_perusahaan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Dokter Hewan - Certificates */}
          {(userRole === 'dokter-hewan' || userRole === 'perawat-hewan') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Sertifikat Kompetensi</h3>
              <div className="mb-4">
                {formData.sertifikat && formData.sertifikat.length > 0 ? (
                  <div className="mb-4 space-y-2">
                    {formData.sertifikat.map((sertifikat, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white border rounded-md">
                        <span className="text-sm">
                          <span className="font-medium">{sertifikat.nomorSertifikat}</span> - {sertifikat.namaSertifikat}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSertifikat(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-4">Belum ada sertifikat yang ditambahkan</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="nomorSertifikat"
                    value={newSertifikat.nomorSertifikat}
                    onChange={handleSertifikatChange}
                    placeholder="Nomor Sertifikat"
                    className="border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <input
                    type="text"
                    name="namaSertifikat"
                    value={newSertifikat.namaSertifikat}
                    onChange={handleSertifikatChange}
                    placeholder="Nama Sertifikat"
                    className="border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={addSertifikat}
                    className="bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition-colors"
                  >
                    Tambah Sertifikat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dokter Hewan - Jadwal Praktik */}
          {userRole === 'dokter-hewan' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Jadwal Praktik</h3>
              <div className="mb-4">
                {formData.jadwalPraktik && formData.jadwalPraktik.length > 0 ? (
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.jadwalPraktik.map((jadwal, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white border rounded-md">
                        <span className="text-sm">
                          <span className="font-medium">{jadwal.hari}:</span> {jadwal.jam}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeJadwal(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-4">Belum ada jadwal yang ditambahkan</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    name="hari"
                    value={newJadwal.hari}
                    onChange={handleJadwalChange}
                    className="border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {hariOptions.map((hari) => (
                      <option key={hari} value={hari}>{hari}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="jam"
                    value={newJadwal.jam}
                    onChange={handleJadwalChange}
                    placeholder="Contoh: 09:00-17:00"
                    className="border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={addJadwal}
                    className="bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition-colors"
                  >
                    Tambah Jadwal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}