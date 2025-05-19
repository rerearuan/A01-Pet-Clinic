'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  hewan: string;
  klien: string;
  waktu: string;
  dokter: string;
  tipe: string;
  status: 'Menunggu' | 'Sedang Berlangsung' | 'Selesai';
}

interface Client {
  id: string;
  nama: string;
  tipe: 'Individu' | 'Perusahaan';
  tanggalRegistrasi: string;
  email: string;
}

interface UserData {
  no_pegawai?: string;
  email?: string;
  tanggal_mulai_kerja?: string;
  tanggal_akhir_kerja?: string;
  alamat?: string;
  nomor_telepon?: string;
}

interface FrontDeskDashboardProps {
  userData: UserData;
  onUpdatePassword: () => void;
  onUpdateProfile: () => void;
}

export default function FrontDeskDashboard({ userData, onUpdatePassword, onUpdateProfile }: FrontDeskDashboardProps) {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Mock data for development (keeping as dummy per your request)
        setTodayAppointments([
          {
            id: 'apt1',
            hewan: 'Fluffy',
            klien: 'Amanda Zahra',
            waktu: '13:00',
            dokter: 'dr. Bobby',
            tipe: 'Vaksinasi',
            status: 'Menunggu',
          },
          {
            id: 'apt2',
            hewan: 'Rex',
            klien: 'PT Hewan Sehat',
            waktu: '14:30',
            dokter: 'dr. Bobby',
            tipe: 'Pemeriksaan',
            status: 'Sedang Berlangsung',
          },
          {
            id: 'apt3',
            hewan: 'Charlie',
            klien: 'John Doe',
            waktu: '15:45',
            dokter: 'dr. Bobby',
            tipe: 'Keperawatan',
            status: 'Selesai',
          },
        ]);

        setRecentClients([
          {
            id: 'client1',
            nama: 'Amanda Zahra',
            tipe: 'Individu',
            tanggalRegistrasi: '26 Januari 2025',
            email: 'klien_individu_1@gmail.com',
          },
          {
            id: 'client2',
            nama: 'PT Hewan Sehat',
            tipe: 'Perusahaan',
            tanggalRegistrasi: '25 Januari 2025',
            email: 'pthewansehat@example.com',
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusColor = (status: Appointment['status']) => {
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

  // Utility function to format dates
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
          <h2 className="text-xl font-semibold">Profile Front-Desk Officer</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nomor Identitas</p>
              <p className="font-medium">{userData.no_pegawai || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{userData.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Mulai Kerja</p>
              <p className="font-medium">{formatDate(userData.tanggal_mulai_kerja)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tanggal Akhir Kerja</p>
              <p className="font-medium">{formatDate(userData.tanggal_akhir_kerja)}</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/clients/register" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Registrasi Klien Baru</h3>
          <p className="text-gray-600">Registrasi klien individu atau perusahaan baru</p>
        </Link>
        <Link href="/appointments/manage" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kelola Kunjungan</h3>
          <p className="text-gray-600">Buat atau ubah jadwal kunjungan</p>
        </Link>
        <Link href="/reports" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Laporan</h3>
          <p className="text-gray-600">Lihat dan download laporan klinik</p>
        </Link>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kunjungan Hari Ini</h2>
          <Link href="/appointments/manage" className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium">
            Kelola Semua
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hewan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Klien
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.hewan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.klien}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="text-green-600 hover:text-green-800 mr-3"
                        >
                          Detail
                        </Link>
                        <Link
                          href={`/appointments/${appointment.id}/check-in`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Check-in
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada kunjungan terjadwal untuk hari ini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-700 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Klien Terbaru</h2>
          <Link href="/clients" className="bg-white text-green-700 px-3 py-1 rounded-md text-sm font-medium">
            Lihat Semua
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : recentClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Registrasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentClients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.tipe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.tanggalRegistrasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/clients/${client.id}`}
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
              <p>Tidak ada klien terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}