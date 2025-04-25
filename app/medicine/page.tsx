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
    <div className="container">
      <nav className="navbar">
        <h1>Veterinary Clinic - Medicine Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Medicine"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Create New Medicine Form */}
      <div className="form-container">
        <h2>Create New Medicine</h2>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Name of Medicine</label>
            <input
              type="text"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
              placeholder="Medicine Name"
            />
          </div>
          <div className="input-group">
            <label>Price</label>
            <input
              type="text"
              value={newMedicine.price}
              onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
              placeholder="Price"
            />
          </div>
          <div className="input-group">
            <label>Stock</label>
            <input
              type="text"
              value={newMedicine.stock}
              onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
              placeholder="Stock"
            />
          </div>
          <div className="input-group">
            <label>Dose</label>
            <input
              type="text"
              value={newMedicine.dose}
              onChange={(e) => setNewMedicine({ ...newMedicine, dose: e.target.value })}
              placeholder="Dose"
            />
          </div>
          <button type="submit" className="btn">Create</button>
        </form>
      </div>

      {/* Update Medicine Form */}
      {editMedicine && (
        <div className="form-container">
          <h2>Update Medicine</h2>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Code</label>
              <input type="text" value={editMedicine.code} disabled />
            </div>
            <div className="input-group">
              <label>Name of Medicine</label>
              <input
                type="text"
                value={editMedicine.name}
                onChange={(e) => setEditMedicine({ ...editMedicine, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Price</label>
              <input
                type="text"
                value={editMedicine.price}
                onChange={(e) => setEditMedicine({ ...editMedicine, price: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Stock</label>
              <input
                type="text"
                value={editMedicine.stock}
                onChange={(e) => setEditMedicine({ ...editMedicine, stock: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Dose</label>
              <input
                type="text"
                value={editMedicine.dose}
                onChange={(e) => setEditMedicine({ ...editMedicine, dose: e.target.value })}
              />
            </div>
            <button type="submit" className="btn">Update</button>
          </form>
        </div>
      )}

      {/* List of Medicines */}
      <div className="list-container">
        <h2>List of Medicines</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Code</th>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Dose</th>
              <th>Action</th>
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
                  <button className="btn" onClick={() => setEditMedicine({ ...medicine, price: medicine.price.toString(), stock: medicine.stock.toString(), dose: medicine.dose })}>Update</button>
                  <button className="btn" onClick={() => handleDelete(medicine.code)}>Delete</button>
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

        .input-group input {
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

export default MedicinePage;
