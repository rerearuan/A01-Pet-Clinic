'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Define types for our roles
type RoleType = 'individu' | 'perusahaan' | 'front-desk-officer' | 'dokter-hewan' | 'perawat-hewan';

export default function RegisterForm() {
  const router = useRouter();
  const params = useParams();
  const role = params.role as RoleType;

  // Validate that role is valid
  useEffect(() => {
    const validRoles: RoleType[] = ['individu', 'perusahaan', 'front-desk-officer', 'dokter-hewan', 'perawat-hewan'];
    if (!validRoles.includes(role as RoleType)) {
      router.push('/register');
    }
  }, [role, router]);

  // Shared state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Client-individual specific state
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  // Client-company specific state
  const [company, setCompany] = useState('');

  // Employee-specific state
  const [employeeId, setEmployeeId] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the registration data object based on role
    const registrationData = {
      role,
      email,
      password,
      phone,
      address,
      // Add role-specific fields
      ...(role === 'individu' && { firstName, middleName, lastName }),
      ...(role === 'perusahaan' && { company }),
      ...(['dokter-hewan', 'perawat-hewan', 'front-desk-officer'].includes(role) && 
          { employeeId, ...(role !== 'front-desk-officer' && { specialization }) })
    };

    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(registrationData),
      // });
      
      // if (response.ok) {
      //   const data = await response.json();
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('isAuthenticated', 'true');
      //   router.push('/dashboard');
      // }

      console.log('Registration data:', registrationData);
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  // Format the role title for display
  const formatRoleTitle = (roleString: string) => {
    return roleString.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 space-y-6">
        <h2 className="text-2xl font-bold text-center">Registrasi: {formatRoleTitle(role)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
              placeholder="Email"
            />
          </div>

          {/* Role-specific fields */}
          {role === 'individu' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Depan *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Tengah</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Belakang *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
                />
              </div>
            </>
          )}

          {role === 'perusahaan' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nama Perusahaan *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {['dokter-hewan', 'perawat-hewan', 'front-desk-officer'].includes(role) && (
            <div>
              <label className="block text-sm font-medium mb-1">ID Pegawai *</label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          {['dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div>
              <label className="block text-sm font-medium mb-1">Spesialisasi *</label>
              <input
                type="text"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Telepon *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Alamat *</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Register
            </button>
            <Link href="/register" className="text-center text-sm text-gray-600 hover:underline">
              Kembali ke Pilihan Role
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}