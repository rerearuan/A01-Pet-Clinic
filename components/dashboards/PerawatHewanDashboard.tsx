import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Certificate {
  nomorSertifikat: string;
  namaSertifikat: string;
}

interface UserData {
  no_pegawai?: string; // Maps to Nomor Identitas in the image
  no_izin_praktik?: string;
  email?: string;
  tanggal_mulai_kerja?: string; // Maps to Tanggal Diterima in the image
  tanggal_akhir_kerja?: string;
  alamat?: string;
  nomor_telepon?: string;
  sertifikat?: Certificate[];
}

interface PerawatHewanDashboardProps {
  userData: UserData;
  onUpdatePassword: () => void;
  onUpdateProfile: () => void;
}

export default function PerawatHewanDashboard({
  userData,
  onUpdatePassword,
  onUpdateProfile,
}: PerawatHewanDashboardProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(userData.sertifikat || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCertificates(userData.sertifikat || []);
  }, [userData]);

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
          <h2 className="text-xl font-semibold">Profile Perawat Hewan</h2>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/patients/record"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Catat Vital Sign</h3>
          <p className="text-gray-600">Catat suhu dan berat badan hewan</p>
        </Link>
        <Link
          href="/nursing-tasks"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tugas Keperawatan</h3>
          <p className="text-gray-600">Kelola tugas-tugas keperawatan</p>
        </Link>
        <Link
          href="/vaccinations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">Administrasi Vaksin</h3>
          <p className="text-gray-600">Kelola vaksinasi hewan</p>
        </Link>
      </div>

      {/* Placeholder for Today's Appointments and Nursing Tasks */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kunjungan Hari Ini</h2>
          <Link
            href="/appointments"
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tugas Keperawatan</h2>
          <Link
            href="/nursing-tasks"
            className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <p>Data tugas keperawatan tidak ditampilkan dalam contoh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
