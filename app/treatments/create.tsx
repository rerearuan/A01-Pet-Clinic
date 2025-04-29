'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateVisitForm() {
  const [formData, setFormData] = useState({
    clientId: '',
    petName: '',
    visitMethod: '',
    startTime: '',
    endTime: ''
  });

  // Sample data for dropdowns
  const clients = [
    { id: 'CL-1001', name: 'John Doe' },
    { id: 'CL-1002', name: 'Jane Smith' },
    { id: 'CL-1003', name: 'Robert Johnson' }
  ];

  const pets = [
    { id: 'PT-1001', name: 'Fluffy', clientId: 'CL-1001' },
    { id: 'PT-1002', name: 'Max', clientId: 'CL-1001' },
    { id: 'PT-1003', name: 'Bella', clientId: 'CL-1002' },
    { id: 'PT-1004', name: 'Charlie', clientId: 'CL-1003' }
  ];

  const visitMethods = [
    'Janji Temu',
    'Walk-in',
    'Emergency',

  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Kunjungan berhasil dibuat!');
    // Add your form submission logic here
  };

  // Filter pets based on selected client
  const filteredPets = formData.clientId 
    ? pets.filter(pet => pet.clientId === formData.clientId)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Create Kunjungan</h1>
        <Link 
          href="/visits"
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Back to List
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Klien</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
              required
            >
              <option value="">Pilih ID Klien</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.id} - {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Hewan</label>
            <select
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
              required
              disabled={!formData.clientId}
            >
              <option value="">Pilih Nama Hewan</option>
              {filteredPets.map(pet => (
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metode Kunjungan</label>
            <select
              name="visitMethod"
              value={formData.visitMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
              required
            >
              <option value="">Pilih Metode Kunjungan</option>
              {visitMethods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai Penanganan</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Akhir Penanganan</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#FD7E14] focus:border-[#FD7E14]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link
              href="/visits"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FD7E14] text-white rounded-md text-sm font-medium hover:bg-[#E67112]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}