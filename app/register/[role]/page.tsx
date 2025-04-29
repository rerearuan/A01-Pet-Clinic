'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterRolePage() {
  const { role } = useParams();
  const router = useRouter();

  // Common state (email, password, phone, address)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const valid = ['individu','perusahaan','front-desk-officer','dokter-hewan','perawat-hewan'];
    if (!valid.includes(Array.isArray(role) ? role[0] : role!)) router.push('/register');
  }, [role, router]);

  const getTitle = () => {
    switch (role) {
      case 'individu': return 'Klien - Individu';
      case 'perusahaan': return 'Klien - Perusahaan';
      case 'front-desk-officer': return 'Front Desk Officer';
      case 'dokter-hewan': return 'Dokter Hewan';
      case 'perawat-hewan': return 'Perawat Hewan';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Register - {getTitle()}</h1>
          <Link href="/register" className="text-gray-500 hover:text-gray-700">Back</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nomor Telepon *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Alamat *</label>
            <textarea
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          {/* TODO: add role-specific fields here */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 w-full text-white px-4 py-2 rounded-full flex justify-center gap-2 transition-shadow shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
