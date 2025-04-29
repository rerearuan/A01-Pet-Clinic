'use client';  

import React, { useState } from 'react';

const PrescriptionPage = () => {
  const [treatments] = useState([
    { code: 'TRM001', name: 'Pemeriksaan Umum' },
    { code: 'TRM002', name: 'Pembersihan Telinga' },
    { code: 'TRM003', name: 'Perawatan Bulu dan Kuku' },
    { code: 'TRM004', name: 'Perawatan Reproduksi' },
    { code: 'TRM005', name: 'Penanganan Luka Ringan' },
  ]);

  const [medicines] = useState([
    { code: 'MED001', name: 'Amoxicillin 250 mg Suspensi', stock: 30, price: 45000 },
    { code: 'MED002', name: 'Meloxicam 5 mg Tablet', stock: 25, price: 60000 },
    { code: 'MED003', name: 'Ivermectin 1 % Injeksi', stock: 18, price: 85000 },
    { code: 'MED004', name: 'Ketoconazole 2 % Shampoo', stock: 22, price: 75000 },
    { code: 'MED005', name: 'Prednison 5 mg Tablet', stock: 40, price: 35000 },
    { code: 'MED006', name: 'Doxycycline 50 mg Kapsul', stock: 28, price: 55000 },
    { code: 'MED007', name: 'Gentamicin 0,3 % Tetes Mata', stock: 35, price: 25000 },
    { code: 'MED008', name: 'Vaksin Rabies Inaktif', stock: 20, price: 95000 },
    { code: 'MED009', name: 'Vitamin B-Kompleks Injeksi', stock: 27, price: 30000 },
    { code: 'MED010', name: 'Fipronil 0,25 % Spray', stock: 24, price: 68000 },
  ]);

  const [prescriptions, setPrescriptions] = useState([
    { treatment: 'TRM001 - Pemeriksaan Umum', medicine: 'MED001 - Amoxicillin 250 mg Suspensi', quantity: 8, totalPrice: 360000 },
    { treatment: 'TRM002 - Pembersihan Telinga', medicine: 'MED002 - Meloxicam 5 mg Tablet', quantity: 7, totalPrice: 420000 },
    { treatment: 'TRM003 - Perawatan Bulu dan Kuku', medicine: 'MED003 - Ivermectin 1 % Injeksi', quantity: 6, totalPrice: 510000 },
    { treatment: 'TRM004 - Perawatan Reproduksi', medicine: 'MED004 - Ketoconazole 2 % Shampoo', quantity: 6, totalPrice: 450000 },
    { treatment: 'TRM005 - Penanganan Luka Ringan', medicine: 'MED005 - Prednison 5 mg Tablet', quantity: 9, totalPrice: 315000 },
    { treatment: 'TRM001 - Pemeriksaan Umum', medicine: 'MED006 - Doxycycline 50 mg Kapsul', quantity: 10, totalPrice: 550000 },
    { treatment: 'TRM002 - Pembersihan Telinga', medicine: 'MED007 - Gentamicin 0,3 % Tetes Mata', quantity: 6, totalPrice: 150000 },
    { treatment: 'TRM003 - Perawatan Bulu dan Kuku', medicine: 'MED008 - Vaksin Rabies Inaktif', quantity: 9, totalPrice: 855000 },
    { treatment: 'TRM004 - Perawatan Reproduksi', medicine: 'MED009 - Vitamin B-Kompleks Injeksi', quantity: 10, totalPrice: 300000 },
    { treatment: 'TRM005 - Penanganan Luka Ringan', medicine: 'MED010 - Fipronil 0,25 % Spray', quantity: 7, totalPrice: 476000 },
  ]);

  const [newPrescription, setNewPrescription] = useState({ treatment: '', medicine: '', quantity: 1 });
  const [editPrescription, setEditPrescription] = useState<{ treatment: string, medicine: string, quantity: number, totalPrice: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMedicine = medicines.find(med => med.code === newPrescription.medicine);
    if (selectedMedicine && newPrescription.quantity <= selectedMedicine.stock) {
      const totalPrice = selectedMedicine.price * newPrescription.quantity;
      setPrescriptions([...prescriptions, {
        treatment: treatments.find(trmt => trmt.code === newPrescription.treatment)?.name || '',
        medicine: selectedMedicine.name,
        quantity: newPrescription.quantity,
        totalPrice
      }]);
      setNewPrescription({ treatment: '', medicine: '', quantity: 1 });
    } else {
      alert('Invalid quantity or not enough stock');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrescription) {
      const selectedMedicine = medicines.find(med => med.code === editPrescription.medicine);
      if (selectedMedicine && editPrescription.quantity <= selectedMedicine.stock) {
        const totalPrice = selectedMedicine.price * editPrescription.quantity;
        setPrescriptions(prescriptions.map(prescription =>
          prescription.medicine === editPrescription.medicine && prescription.treatment === editPrescription.treatment
            ? { ...prescription, quantity: editPrescription.quantity, totalPrice }
            : prescription
        ));
        setEditPrescription(null);
      } else {
        alert('Invalid quantity or not enough stock');
      }
    }
  };

  const handleDelete = (treatment: string, medicine: string) => {
    if (confirm('Are you sure you want to delete this prescription?')) {
      setPrescriptions(prescriptions.filter(prescription =>
        prescription.treatment !== treatment || prescription.medicine !== medicine
      ));
    }
  };

  // Filter prescriptions based on the search term
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medicine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-black text-white p-5">
        <h1 className="text-center text-xl font-semibold">Pet Clinic - Prescription Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-10 mb-5">
        <input
          type="text"
          placeholder="Search Prescription"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Create New Prescription Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6">Create New Prescription</h2>
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Jenis Perawatan</label>
            <select value={newPrescription.treatment} onChange={(e) => setNewPrescription({ ...newPrescription, treatment: e.target.value })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500">
              {treatments.map(treatment => (
                <option key={treatment.code} value={treatment.code}>
                  {treatment.code} - {treatment.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Obat</label>
            <select value={newPrescription.medicine} onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500">
              {medicines.map(medicine => (
                <option key={medicine.code} value={medicine.code}>
                  {medicine.code} - {medicine.name} [{medicine.stock}]
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Kuantitas Obat</label>
            <input
              type="number"
              value={newPrescription.quantity}
              onChange={(e) => setNewPrescription({ ...newPrescription, quantity: parseInt(e.target.value) })}
              min="1"
              max={medicines.find(med => med.code === newPrescription.medicine)?.stock || 0}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Create</button>
        </form>
      </div>

      {/* Update Prescription Form */}
      {editPrescription && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6">Update Prescription</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Jenis Perawatan</label>
              <input type="text" value={editPrescription.treatment} disabled className="w-full p-3 rounded-lg bg-gray-100 border" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Obat</label>
              <input type="text" value={editPrescription.medicine} disabled className="w-full p-3 rounded-lg bg-gray-100 border" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Kuantitas Obat</label>
              <input
                type="number"
                value={editPrescription.quantity}
                onChange={(e) => setEditPrescription({ ...editPrescription, quantity: parseInt(e.target.value) })}
                min="1"
                max={medicines.find(med => med.code === editPrescription.medicine)?.stock || 0}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Update</button>
          </form>
        </div>
      )}

      {/* List Prescriptions */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6">List of Prescriptions</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">No</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Jenis Perawatan</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Obat</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Kuantitas Obat</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Total Harga</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((prescription, index) => (
              <tr key={index}>
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{prescription.treatment}</td>
                <td className="py-3 px-6">{prescription.medicine}</td>
                <td className="py-3 px-6">{prescription.quantity}</td>
                <td className="py-3 px-6">Rp{prescription.totalPrice.toLocaleString()}</td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-black text-white py-1 px-3 rounded-lg hover:bg-gray-800 transition"
                    onClick={() => setEditPrescription(prescription)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(prescription.treatment, prescription.medicine)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionPage;
