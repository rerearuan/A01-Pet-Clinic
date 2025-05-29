'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';

interface Medicine {
  kode: string;
  nama: string;
  harga: number;
  stok: number;
  dosis: string;
}

interface FormData {
  nama: string;
  harga: string;
  stok: string;
  dosis: string;
}

const MedicinePage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ nama: '', harga: '', stok: '', dosis: '' });
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch medicines from API
  const fetchMedicines = async (search = '') => {
    try {
      setLoading(true);
      const url = search ? `/api/medicines?search=${encodeURIComponent(search)}` : '/api/medicines';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMedicines(data.data);
      } else {
        showNotification('error', 'Failed to fetch medicines');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      showNotification('error', 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchMedicines(value);
  };

  // Handle create medicine
  const handleCreate = async () => {
    if (!formData.nama || !formData.harga || !formData.stok || !formData.dosis) {
      showNotification('error', 'All fields are required');
      return;
    }

    if (isNaN(Number(formData.harga)) || isNaN(Number(formData.stok))) {
      showNotification('error', 'Price and stock must be valid numbers');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Medicine created successfully');
        setFormData({ nama: '', harga: '', stok: '', dosis: '' });
        setShowCreateForm(false);
        fetchMedicines(searchTerm);
      } else {
        showNotification('error', data.error || 'Failed to create medicine');
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
      showNotification('error', 'Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update medicine
  const handleUpdate = async (kode: string) => {
    if (!formData.nama || !formData.harga || !formData.stok || !formData.dosis) {
      showNotification('error', 'All fields are required');
      return;
    }

    if (isNaN(Number(formData.harga)) || isNaN(Number(formData.stok))) {
      showNotification('error', 'Price and stock must be valid numbers');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/medicines/${kode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Medicine updated successfully');
        setEditingMedicine(null);
        setFormData({ nama: '', harga: '', stok: '', dosis: '' });
        fetchMedicines(searchTerm);
      } else {
        showNotification('error', data.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      showNotification('error', 'Error connecting to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete medicine
  const handleDelete = async (kode: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const response = await fetch(`/api/medicines/${kode}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Medicine deleted successfully');
        fetchMedicines(searchTerm);
      } else {
        showNotification('error', data.error || 'Failed to delete medicine');
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      showNotification('error', 'Error connecting to server');
    }
  };

  // Start editing
  const startEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine.kode);
    setFormData({
      nama: medicine.nama,
      harga: medicine.harga.toString(),
      stok: medicine.stok.toString(),
      dosis: medicine.dosis
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingMedicine(null);
    setShowCreateForm(false);
    setFormData({ nama: '', harga: '', stok: '', dosis: '' });
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medicine Management</h1>
              <p className="text-gray-600 mt-1">Manage your veterinary clinic medicines</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Medicine</h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rp)</label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stok}
                  onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  value={formData.dosis}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter dosage instructions"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <Save className="w-5 h-5" />
                  {isSubmitting ? 'Creating...' : 'Create Medicine'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Medicine List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Medicine Inventory</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No medicines found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.map((medicine) => (
                    <tr key={medicine.kode} className="hover:bg-gray-50">
                      {editingMedicine === medicine.kode ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medicine.kode}</td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.nama}
                              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.harga}
                              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={formData.stok}
                              onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.dosis}
                              onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(medicine.kode)}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors duration-200"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medicine.kode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medicine.nama}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp{medicine.harga.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              medicine.stok > 10 ? 'bg-green-100 text-green-800' : 
                              medicine.stok > 5 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {medicine.stok} units
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{medicine.dosis}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => startEdit(medicine)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(medicine.kode)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicinePage;

