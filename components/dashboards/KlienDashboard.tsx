'use client';

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
  const currentDate = new Date().toLocaleDateString('id-ID'); // May 29, 2025

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-orange-500 text-white">
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
    </div>
  );
}