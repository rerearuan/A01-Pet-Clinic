'use client';

import React, { useState } from 'react';

const TreatmentPage = () => {
  const [treatments, setTreatments] = useState([
    { code: 'TRM001', name: 'Pemeriksaan Umum', cost: 50000 },
    { code: 'TRM002', name: 'Pembersihan Telinga', cost: 40000 },
    { code: 'TRM003', name: 'Perawatan Bulu dan Kuku', cost: 70000 },
    { code: 'TRM004', name: 'Perawatan Reproduksi', cost: 250000 },
    { code: 'TRM005', name: 'Penanganan Luka Ringan', cost: 60000 },
  ]);

  const [newTreatment, setNewTreatment] = useState({ name: '', cost: '' });
  const [editTreatment, setEditTreatment] = useState<{ code: string, name: string, cost: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTreatment.name && !isNaN(Number(newTreatment.cost))) {
      const newCode = `TRM00${treatments.length + 1}`;
      setTreatments([...treatments, { code: newCode, name: newTreatment.name, cost: Number(newTreatment.cost) }]);
      setNewTreatment({ name: '', cost: '' });
    } else {
      alert('Please enter valid data for treatment name and cost');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTreatment && !isNaN(Number(editTreatment.cost))) {
      setTreatments(treatments.map(treatment =>
        treatment.code === editTreatment.code ? { ...treatment, name: editTreatment.name, cost: Number(editTreatment.cost) } : treatment
      ));
      setEditTreatment(null);
    } else {
      alert('Please enter valid data for treatment name and cost');
    }
  };

  const handleDelete = (code: string) => {
    if (confirm('Are you sure you want to delete this treatment?')) {
      setTreatments(treatments.filter(treatment => treatment.code !== code));
    }
  };

  // Filter treatments based on the search term
  const filteredTreatments = treatments.filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-black text-white p-5">
        <h1 className="text-center text-xl font-semibold">Pet Clinic - Treatment Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-10 mb-5">
        <input
          type="text"
          placeholder="Search Treatment"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Create New Treatment Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6">Create New Treatment</h2>
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name of Treatment</label>
            <input
              type="text"
              value={newTreatment.name}
              onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
              placeholder="Treatment Name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="text"
              value={newTreatment.cost}
              onChange={(e) => setNewTreatment({ ...newTreatment, cost: e.target.value })}
              placeholder="Cost"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Create</button>
        </form>
      </div>

      {/* Update Treatment Form */}
      {editTreatment && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6">Update Treatment</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input type="text" value={editTreatment.code} disabled className="w-full p-3 rounded-lg bg-gray-100 border" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name of Treatment</label>
              <input
                type="text"
                value={editTreatment.name}
                onChange={(e) => setEditTreatment({ ...editTreatment, name: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="text"
                value={editTreatment.cost}
                onChange={(e) => setEditTreatment({ ...editTreatment, cost: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">Update</button>
          </form>
        </div>
      )}

      {/* List Treatments */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6">List of Treatments</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">No</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Treatment Code</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Treatment Name</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Cost</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((treatment, index) => (
              <tr key={treatment.code}>
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{treatment.code}</td>
                <td className="py-3 px-6">{treatment.name}</td>
                <td className="py-3 px-6">Rp{treatment.cost.toLocaleString()}</td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-black text-white py-1 px-3 rounded-lg hover:bg-gray-800 transition"
                    onClick={() => setEditTreatment({ ...treatment, cost: treatment.cost.toString() })}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(treatment.code)}
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

export default TreatmentPage;
