'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterRolePageProps {
  params: {
    role: string;
  };
}

export default function RegisterRolePage({ params }: RegisterRolePageProps) {
  const router = useRouter();
  const { role } = params;

  // Validate role
  useEffect(() => {
    const validRoles = ['individu', 'perusahaan', 'front-desk-officer', 'dokter-hewan', 'perawat-hewan'];
    if (!validRoles.includes(role)) {
      router.push('/register');
    }
  }, [role, router]);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Klien Individu fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  // Klien Perusahaan fields
  const [companyName, setCompanyName] = useState('');

  // Staff fields
  const [receivedDate, setReceivedDate] = useState('');

  // Medical staff fields (dokter-hewan & perawat-hewan)
  const [licenseNumber, setLicenseNumber] = useState('');
  const [certificates, setCertificates] = useState([{ number: '', name: '' }]);
  
  // Dokter Hewan additional fields
  const [practiceSchedules, setPracticeSchedules] = useState([{ day: '', time: '' }]);

  const handleAddCertificate = () => {
    setCertificates([...certificates, { number: '', name: '' }]);
  };

  const handleCertificateChange = (index: number, field: keyof typeof certificates[0], value: string) => {
      const updatedCertificates = [...certificates];
      updatedCertificates[index][field] = value;
      setCertificates(updatedCertificates);
  };

  const handleAddPracticeSchedule = () => {
    setPracticeSchedules([...practiceSchedules, { day: '', time: '' }]);
  };

  const handlePracticeScheduleChange = (index: number, field: keyof typeof practiceSchedules[0], value: string) => {
    const updatedSchedules = [...practiceSchedules];
    updatedSchedules[index][field] = value;
    setPracticeSchedules(updatedSchedules);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create registration data based on role
    let registrationData: Record<string, any> = {
      role,
      email,
      password,
      phone,
      address,
    };

    // Add role-specific data
    switch (role) {
      case 'individu':
        registrationData = {
          ...registrationData,
          firstName,
          middleName,
          lastName,
        };
        break;
      case 'perusahaan':
        registrationData = {
          ...registrationData,
          companyName,
        };
        break;
      case 'front-desk-officer':
        registrationData = {
          ...registrationData,
          receivedDate,
        };
        break;
      case 'dokter-hewan':
        registrationData = {
          ...registrationData,
          licenseNumber,
          receivedDate,
          certificates,
          practiceSchedules,
        };
        break;
      case 'perawat-hewan':
        registrationData = {
          ...registrationData,
          licenseNumber,
          receivedDate,
          certificates,
        };
        break;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Registration data:', registrationData);
      
      // Simulate successful registration
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Helper function to get the title based on role
  const getRoleTitle = () => {
    switch (role) {
      case 'individu': return 'Klien - Individu';
      case 'perusahaan': return 'Klien - Perusahaan';
      case 'front-desk-officer': return 'Front-Desk Officer';
      case 'dokter-hewan': return 'Dokter Hewan';
      case 'perawat-hewan': return 'Perawat Hewan';
      default: return 'Register';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">FORM REGISTER</h2>
        <h3 className="text-lg font-medium text-center mb-6">{getRoleTitle()}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Medical Staff Fields */}
          {['dokter-hewan', 'perawat-hewan'].includes(role) && (
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Informasi Umum</h4>
                <div>
                  <label className="block text-sm font-medium mb-1">Nomor Izin Praktik *</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                    placeholder="Nomor Izin Praktik"
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Email Field (Common) */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              placeholder="Email"
            />
          </div>

          {/* Individu Fields */}
          {role === 'individu' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Depan *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                  placeholder="Nama Depan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Tengah</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                  placeholder="Nama Tengah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Belakang *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                  placeholder="Nama Belakang"
                />
              </div>
            </>
          )}

          {/* Perusahaan Fields */}
          {role === 'perusahaan' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nama Perusahaan *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                placeholder="Nama Perusahaan"
              />
            </div>
          )}

          {/* Password Field (Common) */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              placeholder="Password"
            />
          </div>

          {/* Phone Field (Common) */}
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Telepon *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              placeholder="Nomor Telepon"
            />
          </div>

          {/* Staff Fields */}
          {['front-desk-officer', 'dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Diterima *</label>
              <input
                type="date"
                required
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {/* Address Field (Common) */}
          <div>
            <label className="block text-sm font-medium mb-1">Alamat *</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
              placeholder="Alamat"
            />
          </div>

          {/* Certificate Fields for Medical Staff */}
          {['dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Kompetensi</h4>
              {certificates.map((cert, index) => (
                <div key={index} className="space-y-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nomor Sertifikat *</label>
                    <input
                      type="text"
                      required
                      value={cert.number}
                      onChange={(e) => handleCertificateChange(index, 'number', e.target.value)}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                      placeholder="Nomor Sertifikat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Sertifikat *</label>
                    <input
                      type="text"
                      required
                      value={cert.name}
                      onChange={(e) => handleCertificateChange(index, 'name', e.target.value)}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                      placeholder="Nama Sertifikat"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddCertificate}
                className="flex items-center justify-center text-sm bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700"
              >
                <span className="mr-1">+</span> Tambah Sertifikat
              </button>
            </div>
          )}

          {/* Practice Schedule for Dokter Hewan */}
          {role === 'dokter-hewan' && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Jadwal Praktik</h4>
              {practiceSchedules.map((schedule, index) => (
                <div key={index} className="flex space-x-2 mb-3">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">Hari *</label>
                    <select
                      required
                      value={schedule.day}
                      onChange={(e) => handlePracticeScheduleChange(index, 'day', e.target.value)}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                    >
                      <option value="">Pilih Hari</option>
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                      <option value="Minggu">Minggu</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">Jam *</label>
                    <input
                      type="text"
                      required
                      value={schedule.time}
                      onChange={(e) => handlePracticeScheduleChange(index, 'time', e.target.value)}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                      placeholder="Contoh: 08:00-12:00"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPracticeSchedule}
                className="flex items-center justify-center text-sm bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700"
              >
                <span className="mr-1">+</span> Tambah Jadwal
              </button>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Register
            </button>
            <div className="mt-3 text-center">
              <Link href="/register" className="text-sm text-gray-600 hover:underline">
                Kembali ke Pilihan Role
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}