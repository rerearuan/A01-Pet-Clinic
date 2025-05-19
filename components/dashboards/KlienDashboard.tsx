import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pet {
  nama: string;
  jenis: string;
  tanggalLahir: string;
  url_foto: string;
}

interface Appointment {
  id: string;
  hewan: string;
  tanggal: string;
  waktu: string;
  dokter: string;
  tipe: string;
}

interface UserData {
  no_identitas?: string;
  email?: string;
  nama_depan?: string;
  nama_tengah?: string;
  nama_belakang?: string;
  nama_perusahaan?: string;
  tanggal_registrasi?: string;
  alamat?: string;
  nomor_telepon?: string;
  role?: 'individu' | 'perusahaan';
}

interface KlienDashboardProps {
  userData: UserData;
  onUpdatePassword: () => void;
  onUpdateProfile: () => void;
}

export default function KlienDashboard({ userData, onUpdatePassword, onUpdateProfile }: KlienDashboardProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  console.log('Received userData in KlienDashboard:', JSON.stringify(userData, null, 2)); // Detailed logging

  useEffect(() => {
    setPets([]);
    setAppointments([]);
  }, [userData.no_identitas]);

  const isIndividual = userData.role === 'individu';
  const currentDate = new Date().toLocaleDateString('id-ID'); // May 13, 2025

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white">
          <h2 className="text-xl font-semibold">Profile Klien {isIndividual ? 'Individu' : 'Perusahaan'}</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nomor Identitas</p>
              <p className="font-medium">{userData.no_identitas || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData.email || '-'}</p>
            </div>
            {isIndividual ? (
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-medium">
                  {userData.nama_depan || ''} {userData.nama_tengah || ''} {userData.nama_belakang || ''}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">Nama Perusahaan</p>
                <p className="font-medium">{userData.nama_perusahaan || '-'}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
              <p className="font-medium">{formatDate(userData.tanggal_registrasi) || currentDate}</p>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Hewan Peliharaan</h2>
          <Link
            href="/pets/add"
            className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium"
          >
            Tambah Hewan
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : pets.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div key={`${pet.nama}-${userData.no_identitas}`} className="border rounded-lg overflow-hidden">
                  <img
                    src={pet.url_foto}
                    alt={pet.nama}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/fallback-pet-image.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{pet.nama}</h3>
                    <p className="text-sm text-gray-600">Jenis: {pet.jenis}</p>
                    <p className="text-sm text-gray-600">
                      Tanggal Lahir: {new Date(pet.tanggalLahir).toLocaleDateString('id-ID')}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/pets/${encodeURIComponent(pet.nama)}`}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada hewan peliharaan terdaftar.</p>
              <Link href="/pets/add" className="text-green-600 hover:text-green-800 mt-2 inline-block">
                Tambahkan sekarang
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kunjungan Mendatang</h2>
          <Link
            href="/appointments/book"
            className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium"
          >
            Buat Janji
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hewan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dokter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.hewan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(appointment.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.waktu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.dokter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.tipe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada kunjungan terjadwal.</p>
              <Link href="/appointments/book" className="text-green-600 hover:text-green-800 mt-2 inline-block">
                Buat janji sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}