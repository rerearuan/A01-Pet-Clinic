'use client';  

import React, { useState } from 'react';

const MedicinePage = () => {
  const [medicines, setMedicines] = useState([
    { code: 'MED001', name: 'Amoxicillin 250 mg Suspensi', price: 45000, stock: 30, dose: '1 ml/5 kg BB, 2× sehari, 5 hari' },
    { code: 'MED002', name: 'Meloxicam 5 mg Tablet', price: 60000, stock: 25, dose: '0,1 mg/kg BB, 1× sehari, maks 5 hari' },
    { code: 'MED003', name: 'Ivermectin 1 % Injeksi', price: 85000, stock: 18, dose: '0,2 ml/5 kg BB, s.c., ulang 14 hari' },
    { code: 'MED004', name: 'Ketoconazole 2 % Shampoo', price: 75000, stock: 22, dose: 'Keramas 2× pekan, 10 menit kontak' },
    { code: 'MED005', name: 'Prednison 5 mg Tablet', price: 35000, stock: 40, dose: '0,5 mg/kg BB, 1× sehari, tapering' },
    { code: 'MED006', name: 'Doxycycline 50 mg Kapsul', price: 55000, stock: 28, dose: '5 mg/kg BB, 2× sehari, 7 hari' },
    { code: 'MED007', name: 'Gentamicin 0,3 % Tetes Mata', price: 25000, stock: 35, dose: '1–2 tetes/ mata, 4× sehari, 5 hari' },
    { code: 'MED008', name: 'Vaksin Rabies Inaktif', price: 95000, stock: 20, dose: '1 dosis (1 ml) s.c., booster tahunan' },
    { code: 'MED009', name: 'Vitamin B-Kompleks Injeksi', price: 30000, stock: 27, dose: '0,5 ml/5 kg BB, i.m., 1× minggu' },
    { code: 'MED010', name: 'Fipronil 0,25 % Spray', price: 68000, stock: 24, dose: 'Semprot merata ke bulu, ulang 30 hari' },
  ]);

  const [newMedicine, setNewMedicine] = useState({ name: '', price: '', stock: '', dose: '' });
  const [editMedicine, setEditMedicine] = useState<{ code: string, name: string, price: string, stock: string, dose: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle creation of a new medicine
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedicine.name && !isNaN(Number(newMedicine.price)) && !isNaN(Number(newMedicine.stock))) {
      const newCode = `MED00${medicines.length + 1}`;
      setMedicines([
        ...medicines,
        {
          code: newCode,
          name: newMedicine.name,
          price: Number(newMedicine.price),
          stock: Number(newMedicine.stock),
          dose: newMedicine.dose
        }
      ]);
      setNewMedicine({ name: '', price: '', stock: '', dose: '' });
    } else {
      alert('Please enter valid data for name, price, stock, and dose.');
    }
  };

  // Handle updating an existing medicine
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMedicine && !isNaN(Number(editMedicine.price)) && !isNaN(Number(editMedicine.stock))) {
      setMedicines(medicines.map(medicine =>
        medicine.code === editMedicine.code
          ? { ...medicine, name: editMedicine.name, price: Number(editMedicine.price), stock: Number(editMedicine.stock), dose: editMedicine.dose }
          : medicine
      ));
      setEditMedicine(null);
    } else {
      alert('Please enter valid data for name, price, stock, and dose.');
    }
  };

  // Handle deleting a medicine
  const handleDelete = (code: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(medicine => medicine.code !== code));
    }
  };

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-black text-white p-5">
        <h1 className="text-center text-xl font-semibold">Pet Clinic - Medicine Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-10 mb-5">
        <input
          type="text"
          placeholder="Search Medicine"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Create New Medicine Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6">Create New Medicine</h2>
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name of Medicine</label>
            <input
              type="text"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              placeholder="Medicine Name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              value={newMedicine.price}
              onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
              placeholder="Price"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="text"
              value={newMedicine.stock}
              onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
              placeholder="Stock"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dose</label>
            <input
              type="text"
              value={newMedicine.dose}
              onChange={(e) => setNewMedicine({ ...newMedicine, dose: e.target.value })}
              placeholder="Dose"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Create</button>
        </form>
      </div>

      {/* Update Medicine Form */}
      {editMedicine && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6">Update Medicine</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input type="text" value={editMedicine.code} disabled className="w-full p-3 rounded-lg bg-gray-100 border" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name of Medicine</label>
              <input
                type="text"
                value={editMedicine.name}
                onChange={(e) => setEditMedicine({ ...editMedicine, name: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="text"
                value={editMedicine.price}
                onChange={(e) => setEditMedicine({ ...editMedicine, price: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="text"
                value={editMedicine.stock}
                onChange={(e) => setEditMedicine({ ...editMedicine, stock: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Dose</label>
              <input
                type="text"
                value={editMedicine.dose}
                onChange={(e) => setEditMedicine({ ...editMedicine, dose: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Update</button>
          </form>
        </div>
      )}

      {/* List of Medicines */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6">List of Medicines</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">No</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Code</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Medicine Name</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Price</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Stock</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Dose</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine, index) => (
              <tr key={medicine.code}>
                <td>{index + 1}</td>
                <td>{medicine.code}</td>
                <td>{medicine.name}</td>
                <td>Rp{medicine.price.toLocaleString()}</td>
                <td>{medicine.stock}</td>
                <td>{medicine.dose}</td>
                <td>
                  <button className="bg-black text-white py-1 px-3 rounded-lg hover:bg-gray-800 transition" onClick={() => setEditMedicine({ ...medicine, price: medicine.price.toString(), stock: medicine.stock.toString(), dose: medicine.dose })}>Update</button>
                  <button className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition" onClick={() => handleDelete(medicine.code)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicinePage;
