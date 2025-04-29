'use client';

import React, { useState } from 'react';

// Sample data for user types
const DashboardPage = () => {
  const [userProfile, setUserProfile] = useState({
    type: 'Client', // 'Client', 'Front-Desk Officer', 'Doctor', 'Nurse'
    name: 'Amanda Zahra',
    email: 'klien.individu1@gmail.com',
    phone: '081234567896',
    address: 'Jl. Melati Indah No. 26, Kel. Sukamaju, Kec. Cibinong, Kab. Bogor, Jawa Barat, 16914',
    registrationDate: '26 Januari 2025',
    additionalInfo: null, // Specific data for doctors or nurses
  });

  const handleUpdateProfile = () => {
    // Logic for updating the profile
    alert('Profile Updated!');
  };

  const handleUpdatePassword = () => {
    // Logic for updating the password
    alert('Password Updated!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-black text-white p-5">
        <h1 className="text-center text-xl font-semibold">Dashboard - {userProfile.type} Profile</h1>
      </nav>

      <div className="max-w-4xl mx-auto bg-white p-6 mt-8 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-6">{`${userProfile.type} Profile`}</h2>

        <div className="space-y-4">
          <div>
            <span className="font-medium">Name:</span> {userProfile.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userProfile.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {userProfile.phone}
          </div>
          <div>
            <span className="font-medium">Address:</span> {userProfile.address}
          </div>
          <div>
            <span className="font-medium">Registration Date:</span> {userProfile.registrationDate}
          </div>

          {/* Dynamic Information for Doctor */}
          {userProfile.type === 'Doctor' && (
            <div>
              <span className="font-medium">Certificates:</span>
              <ul>
                <li>BNSP Dokter Hewan Praktis</li>
                <li>PB PDHI</li>
                <li>Organisasi Profesi</li>
              </ul>
            </div>
          )}

          {/* Dynamic Information for Nurse */}
          {userProfile.type === 'Nurse' && (
            <div>
              <span className="font-medium">Certificates:</span>
              <ul>
                <li>Paraprofessional Kedokteran Hewan</li>
                <li>Keperawatan Hewan Profesional</li>
                <li>Organisasi Profesi</li>
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleUpdateProfile}
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800"
            >
              Update Profile
            </button>
            <button
              onClick={handleUpdatePassword}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Update Password */}
      <div id="updatePasswordModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div className="bg-white p-6 rounded-xl shadow-lg w-80">
          <h3 className="text-xl font-bold mb-4">Update Password</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Old Password</label>
              <input type="password" className="w-full p-3 rounded-lg border border-gray-300" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" className="w-full p-3 rounded-lg border border-gray-300" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" className="w-full p-3 rounded-lg border border-gray-300" />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => alert('Password Updated')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('updatePasswordModal')?.classList.add('hidden')}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
