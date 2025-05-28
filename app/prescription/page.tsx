'use client';

import React, { useState, useEffect } from 'react';

interface Treatment {
  kode_perawatan: string;
  nama_perawatan: string;
}

interface Medicine {
  kode: string;
  nama: string;
  stok: number;
  harga: number;
}

interface Prescription {
  kode_perawatan: string;
  kode_obat: string;
  kuantitas_obat: number;
  nama_perawatan: string;
  nama_obat: string;
  harga_obat: number;
  total_harga: number;
}

const PrescriptionPage = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newPrescription, setNewPrescription] = useState({
    kode_perawatan: '',
    kode_obat: '',
    kuantitas_obat: 1,
  });
  const [editPrescription, setEditPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch treatments, medicines, and prescriptions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch treatments
        const treatmentsRes = await fetch('/api/treatments'); // Adjust endpoint if different
        const treatmentsData = await treatmentsRes.json();
        if (!treatmentsData.success) throw new Error(treatmentsData.message);
        setTreatments(treatmentsData.data);

        // Fetch medicines
        const medicinesRes = await fetch('/api/medicines'); // Adjust endpoint if different
        const medicinesData = await medicinesRes.json();
        if (!medicinesData.success) throw new Error(medicinesData.message);
        setMedicines(medicinesData.data);

        // Fetch prescriptions
        const prescriptionsRes = await fetch('/api/prescriptions');
        const prescriptionsData = await prescriptionsRes.json();
        if (!prescriptionsData.success) throw new Error(prescriptionsData.message);
        setPrescriptions(prescriptionsData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle create prescription
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrescription),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPrescriptions([...prescriptions, data.data]);
      setNewPrescription({ kode_perawatan: '', kode_obat: '', kuantitas_obat: 1 });
      alert('Prescription created successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create prescription');
    }
  };

  // Handle update prescription
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrescription) return;
    try {
      const res = await fetch(
        `/api/prescriptions/${editPrescription.kode_perawatan}/${editPrescription.kode_obat}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kuantitas_obat: editPrescription.kuantitas_obat }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPrescriptions(
        prescriptions.map((p) =>
          p.kode_perawatan === editPrescription.kode_perawatan &&
          p.kode_obat === editPrescription.kode_obat
            ? data.data
            : p
        )
      );
      setEditPrescription(null);
      alert('Prescription updated successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update prescription');
    }
  };

  // Handle delete prescription
  const handleDelete = async (kode_perawatan: string, kode_obat: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    try {
      const res = await fetch(`/api/prescriptions/${kode_perawatan}/${kode_obat}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPrescriptions(
        prescriptions.filter(
          (p) => p.kode_perawatan !== kode_perawatan || p.kode_obat !== kode_obat
        )
      );
      alert('Prescription deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete prescription');
    }
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.nama_perawatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.nama_obat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-orange-500 text-white p-5">
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
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Create New Prescription</h2>
        <form onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Jenis Perawatan</label>
            <select
              value={newPrescription.kode_perawatan}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, kode_perawatan: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Treatment</option>
              {treatments.map((treatment) => (
                <option key={treatment.kode_perawatan} value={treatment.kode_perawatan}>
                  {treatment.kode_perawatan} - {treatment.nama_perawatan}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Obat</label>
            <select
              value={newPrescription.kode_obat}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, kode_obat: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Medicine</option>
              {medicines.map((medicine) => (
                <option key={medicine.kode} value={medicine.kode}>
                  {medicine.kode} - {medicine.nama} [Stock: {medicine.stok}]
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Kuantitas Obat</label>
            <input
              type="number"
              value={newPrescription.kuantitas_obat}
              onChange={(e) =>
                setNewPrescription({
                  ...newPrescription,
                  kuantitas_obat: parseInt(e.target.value) || 1,
                })
              }
              min="1"
              max={medicines.find((med) => med.kode === newPrescription.kode_obat)?.stok || 0}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-300 transition"
          >
            Create
          </button>
        </form>
      </div>

      {/* Update Prescription Form */}
      {editPrescription && (
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6">Update Prescription</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Jenis Perawatan</label>
              <input
                type="text"
                value={`${editPrescription.kode_perawatan} - ${editPrescription.nama_perawatan}`}
                disabled
                className="w-full p-3 rounded-lg bg-gray-100 border"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Obat</label>
              <input
                type="text"
                value={`${editPrescription.kode_obat} - ${editPrescription.nama_obat}`}
                disabled
                className="w-full p-3 rounded-lg bg-gray-100 border"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Kuantitas Obat</label>
              <input
                type="number"
                value={editPrescription.kuantitas_obat}
                onChange={(e) =>
                  setEditPrescription({
                    ...editPrescription,
                    kuantitas_obat: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                max={medicines.find((med) => med.kode === editPrescription.kode_obat)?.stok || 0}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Update
            </button>
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
              <tr key={`${prescription.kode_perawatan}-${prescription.kode_obat}`}>
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">
                  {prescription.kode_perawatan} - {prescription.nama_perawatan}
                </td>
                <td className="py-3 px-6">
                  {prescription.kode_obat} - {prescription.nama_obat}
                </td>
                <td className="py-3 px-6">{prescription.kuantitas_obat}</td>
                <td className="py-3 px-6">Rp{prescription.total_harga.toLocaleString()}</td>
                <td className="py-3 px-6 space-x-2">
                  <button
                    className="bg-black text-white py-1 px-3 rounded-lg hover:bg-gray-800Blog transition"
                    onClick={() => setEditPrescription(prescription)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                    onClick={() =>
                      handleDelete(prescription.kode_perawatan, prescription.kode_obat)
                    }
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