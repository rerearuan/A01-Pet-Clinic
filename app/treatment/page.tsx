'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Treatment {
  code: string;
  name: string;
  cost: number;
}

const TreatmentPage = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTreatment, setNewTreatment] = useState({ name: '', cost: '' });
  const [editTreatment, setEditTreatment] = useState<{ code: string, name: string, cost: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingTreatment, setDeletingTreatment] = useState<Treatment | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      const result = await response.json();
      if (result.success) setTreatments(result.data);
      else showAlert('error', 'Failed to fetch treatments');
    } catch {
      showAlert('error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleCreate = async () => {
    if (!newTreatment.name.trim() || !newTreatment.cost.trim() || isNaN(Number(newTreatment.cost))) {
      showAlert('error', 'Please enter valid treatment name and cost');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTreatment.name.trim(),
          cost: Number(newTreatment.cost),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setTreatments([...treatments, result.data]);
        setNewTreatment({ name: '', cost: '' });
        showAlert('success', 'Treatment created successfully');
      } else {
        showAlert('error', result.error || 'Failed to create treatment');
      }
    } catch {
      showAlert('error', 'Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editTreatment || !editTreatment.name.trim() || !editTreatment.cost.trim() || isNaN(Number(editTreatment.cost))) {
      showAlert('error', 'Please enter valid treatment name and cost');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/treatments/${editTreatment.code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editTreatment.name.trim(),
          cost: Number(editTreatment.cost),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setTreatments(treatments.map(t => (t.code === editTreatment.code ? result.data : t)));
        setEditTreatment(null);
        showAlert('success', 'Treatment updated successfully');
      } else {
        showAlert('error', result.error || 'Failed to update treatment');
      }
    } catch {
      showAlert('error', 'Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (code: string) => {
    try {
      const response = await fetch(`/api/treatments/${code}`, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        setTreatments(treatments.filter(t => t.code !== code));
        showAlert('success', 'Treatment deleted successfully');
      } else {
        showAlert('error', result.error || 'Failed to delete treatment');
      }
    } catch {
      showAlert('error', 'Network error occurred');
    } finally {
      setDeletingTreatment(null);
    }
  };

  const filteredTreatments = treatments.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading treatments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deletingTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Treatment Type</h2>
            <p className="text-gray-800 mb-6">
              Apakah kamu yakin untuk menghapus jenis perawatan <span className="font-semibold text-red-500">{deletingTreatment.name}</span> dengan Kode <span className="font-semibold text-red-500">{deletingTreatment.code}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingTreatment(null)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingTreatment.code)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Treatment Management</h1>
            <p className="mt-2 text-gray-600">Manage pet clinic treatments and their pricing</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {alert && (
          <div className={`mb-6 p-4 rounded-md flex items-center space-x-2 ${
            alert.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {alert.type === 'success' ? 
              <CheckCircle className="h-5 w-5" /> : 
              <AlertCircle className="h-5 w-5" />
            }
            <span>{alert.message}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Plus className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Add New Treatment</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment Name
                  </label>
                  <input
                    type="text"
                    value={newTreatment.name}
                    onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
                    placeholder="Enter treatment name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost (Rp)
                  </label>
                  <input
                    type="number"
                    value={newTreatment.cost}
                    onChange={(e) => setNewTreatment({ ...newTreatment, cost: e.target.value })}
                    placeholder="Enter cost"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Treatment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Update Form */}
            {editTreatment && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Edit2 className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Update Treatment</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Treatment Code
                    </label>
                    <input
                      type="text"
                      value={editTreatment.code}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Treatment Name
                    </label>
                    <input
                      type="text"
                      value={editTreatment.name}
                      onChange={(e) => setEditTreatment({ ...editTreatment, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost (Rp)
                    </label>
                    <input
                      type="number"
                      value={editTreatment.cost}
                      onChange={(e) => setEditTreatment({ ...editTreatment, cost: e.target.value })}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdate}
                      disabled={submitting}
                      className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Update</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTreatment(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Treatments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Treatments List</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredTreatments.length} treatment{filteredTreatments.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Treatment Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTreatments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          {searchTerm ? 'No treatments found matching your search.' : 'No treatments available.'}
                        </td>
                      </tr>
                    ) : (
                      filteredTreatments.map((treatment) => (
                        <tr key={treatment.code} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {treatment.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {treatment.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rp {treatment.cost.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => setEditTreatment({ 
                                code: treatment.code, 
                                name: treatment.name, 
                                cost: treatment.cost.toString() 
                              })}
                              className="inline-flex items-center px-3 py-1 border border-orange-300 text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeletingTreatment(treatment)}
                              className="inline-flex items-center px-3 py-1 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPage;