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
    <div className="container">
      <nav className="navbar">
        <h1>Veterinary Clinic - Treatment Management</h1>
      </nav>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Treatment"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Create New Treatment Form */}
      <div className="form-container">
        <h2>Create New Treatment</h2>
        <form onSubmit={handleCreate}>
          <div className="input-group">
            <label>Name of Treatment</label>
            <input
              type="text"
              value={newTreatment.name}
              onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
              placeholder="Treatment Name"
            />
          </div>
          <div className="input-group">
            <label>Cost</label>
            <input
              type="text"
              value={newTreatment.cost}
              onChange={(e) => setNewTreatment({ ...newTreatment, cost: e.target.value })}
              placeholder="Cost"
            />
          </div>
          <button type="submit" className="btn">Create</button>
        </form>
      </div>

      {/* Update Treatment Form */}
      {editTreatment && (
        <div className="form-container">
          <h2>Update Treatment</h2>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label>Code</label>
              <input type="text" value={editTreatment.code} disabled />
            </div>
            <div className="input-group">
              <label>Name of Treatment</label>
              <input
                type="text"
                value={editTreatment.name}
                onChange={(e) => setEditTreatment({ ...editTreatment, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Cost</label>
              <input
                type="text"
                value={editTreatment.cost}
                onChange={(e) => setEditTreatment({ ...editTreatment, cost: e.target.value })}
              />
            </div>
            <button type="submit" className="btn">Update</button>
          </form>
        </div>
      )}

      {/* List Treatments */}
      <div className="list-container">
        <h2>List of Treatments</h2>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Treatment Code</th>
              <th>Treatment Name</th>
              <th>Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((treatment, index) => (
              <tr key={treatment.code}>
                <td>{index + 1}</td>
                <td>{treatment.code}</td>
                <td>{treatment.name}</td>
                <td>Rp{treatment.cost.toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={() => setEditTreatment({ ...treatment, cost: treatment.cost.toString() })}>Update</button>
                  <button className="btn" onClick={() => handleDelete(treatment.code)}>Delete</button>
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

export default TreatmentPage;
