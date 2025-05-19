import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Certificate {
  nomorSertifikat: string;
  namaSertifikat: string;
}

interface Schedule {
  hari: string;
  jam: string;
}

interface UserData {
  no_pegawai?: string; // Maps to noIdentitas in the image
  no_izin_praktik?: string;
  email?: string;
  tanggal_mulai_kerja?: string; // Maps to Tanggal Diterima in the image
  tanggal_akhir_kerja?: string;
  alamat?: string;
  nomor_telepon?: string;
  sertifikat?: Certificate[];
  jadwalPraktik?: Schedule[];
}

interface DokterHewanDashboardProps {
  userData: UserData;
  onUpdatePassword: () => void;
  onUpdateProfile: () => void;
}

export default function DokterHewanDashboard({
  userData,
  onUpdatePassword,
  onUpdateProfile,
}: DokterHewanDashboardProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(userData.sertifikat || []);
  const [schedule, setSchedule] = useState<Schedule[]>(userData.jadwalPraktik || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCertificates(userData.sertifikat || []);
    setSchedule(userData.jadwalPraktik || []);
  }, [userData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sedang Berlangsung':
        return 'bg-blue-100 text-blue-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white">
          <h2 className="text-xl font-semibold">Profile Dokter Hewan</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nomor Identitas</p>
              <p className="font-medium">{userData.no_pegawai || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nomor Izin Praktik</p>
              <p className="font-medium">{userData.no_izin_praktik || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Diterima</p>
              <p className="font-medium">{formatDate(userData.tanggal_mulai_kerja) || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Akhir Kerja</p>
              <p className="font-medium">{formatDate(userData.tanggal_akhir_kerja) || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Alamat</p>
              <p className="font-medium">{userData.alamat || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nomor Telepon</p>
              <p className="font-medium">{userData.nomor_telepon || '-'}</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={onUpdateProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Update Profile
            </button>
            <button
              onClick={onUpdatePassword}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white">
          <h2 className="text-xl font-semibold">Daftar Sertifikat</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : certificates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Sertifikat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Sertifikat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {certificates.map((cert) => (
                    <tr key={cert.nomorSertifikat}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cert.nomorSertifikat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cert.namaSertifikat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Belum ada sertifikat terdaftar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Practice Schedule */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white">
          <h2 className="text-xl font-semibold">Jadwal Praktik</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : schedule.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hari
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((sch, index) => (
                    <tr key={`${sch.hari}-${sch.jam}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sch.hari}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sch.jam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Belum ada jadwal praktik terdaftar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for Today's Appointments and Quick Access */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kunjungan Hari Ini</h2>
          <Link
            href="/doctor/appointments"
            className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <p>Data kunjungan hari ini tidak ditampilkan dalam contoh.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/doctor/medical-records"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Rekam Medis</h3>
          <p className="text-gray-600">Akses semua rekam medis pasien</p>
        </Link>
        <Link
          href="/doctor/treatments"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Perawatan</h3>
          <p className="text-gray-600">Kelola data perawatan dan obat</p>
        </Link>
        <Link
          href="/doctor/vaccines"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vaksin</h3>
          <p className="text-gray-600">Lihat informasi stok vaksin</p>
        </Link>
      </div>
    </div>
  );
}