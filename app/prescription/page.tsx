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

  // Corrected dummy prescriptions based on treatments
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
    <div className="container">
      <nav className="navbar">
        <h1>Veterinary Clinic - Prescription Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Prescription"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Create New Prescription Form */}
      <div className="form-container">
        <h2>Create New Prescription</h2>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Jenis Perawatan</label>
            <select value={newPrescription.treatment} onChange={(e) => setNewPrescription({ ...newPrescription, treatment: e.target.value })}>
              {treatments.map(treatment => (
                <option key={treatment.code} value={treatment.code}>
                  {treatment.code} - {treatment.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Obat</label>
            <select value={newPrescription.medicine} onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}>
              {medicines.map(medicine => (
                <option key={medicine.code} value={medicine.code}>
                  {medicine.code} - {medicine.name} [{medicine.stock}]
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Kuantitas Obat</label>
            <input
              type="number"
              value={newPrescription.quantity}
              onChange={(e) => setNewPrescription({ ...newPrescription, quantity: parseInt(e.target.value) })}
              min="1"
              max={medicines.find(med => med.code === newPrescription.medicine)?.stock || 0}
            />
          </div>
          <button type="submit" className="btn">Create</button>
        </form>
      </div>

      {/* Update Prescription Form */}
      {editPrescription && (
        <div className="form-container">
          <h2>Update Prescription</h2>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Jenis Perawatan</label>
              <input type="text" value={editPrescription.treatment} disabled />
            </div>
            <div className="input-group">
              <label>Obat</label>
              <input type="text" value={editPrescription.medicine} disabled />
            </div>
            <div className="input-group">
              <label>Kuantitas Obat</label>
              <input
                type="number"
                value={editPrescription.quantity}
                onChange={(e) => setEditPrescription({ ...editPrescription, quantity: parseInt(e.target.value) })}
                min="1"
                max={medicines.find(med => med.code === editPrescription.medicine)?.stock || 0}
              />
            </div>
            <button type="submit" className="btn">Update</button>
          </form>
        </div>
      )}

      {/* List Prescriptions */}
      <div className="list-container">
        <h2>List of Prescriptions</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Jenis Perawatan</th>
              <th>Obat</th>
              <th>Kuantitas Obat</th>
              <th>Total Harga</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((prescription, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{prescription.treatment}</td>
                <td>{prescription.medicine}</td>
                <td>{prescription.quantity}</td>
                <td>Rp{prescription.totalPrice.toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={() => setEditPrescription(prescription)}>Update</button>
                  <button className="btn" onClick={() => handleDelete(prescription.treatment, prescription.medicine)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f4f4f4;
          color: #333;
        }

        .navbar {
          background-color: #222;
          color: #fff;
          padding: 10px;
          text-align: center;
        }

        .form-container {
          margin-top: 20px;
          background-color: #fff;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .input-group {
          margin-bottom: 10px;
        }

        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: bold;
        }

        .input-group input, .input-group select {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          font-size: 14px;
        }

        .btn {
          background-color: #333;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
        }

        .btn:hover {
          background-color: #444;
        }

        .list-container {
          margin-top: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        table, th, td {
          border: 1px solid #ddd;
        }

        th, td {
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f4f4f4;
        }

        td button {
          background-color: #333;
          color: white;
          padding: 5px 10px;
          margin-right: 5px;
          cursor: pointer;
        }

        td button:hover {
          background-color: #444;
        }

        .search-container {
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 8px;
          font-size: 14px;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default PrescriptionPage;
