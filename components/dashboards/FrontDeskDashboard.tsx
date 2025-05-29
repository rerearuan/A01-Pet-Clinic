'use client';

import React, { useState, useEffect } from 'react';

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
        <div className="px-6 py-4 bg-orange-500 text-white">
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
    </div>
  );
}