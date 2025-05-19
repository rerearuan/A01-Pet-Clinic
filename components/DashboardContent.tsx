'use client';

import { useState, useEffect } from 'react';
import KlienDashboard from '@/components/dashboards/KlienDashboard';
import FrontDeskDashboard from '@/components/dashboards/FrontDeskDashboard';
import DokterHewanDashboard from '@/components/dashboards/DokterHewanDashboard';
import PerawatHewanDashboard from '@/components/dashboards/PerawatHewanDashboard';
import UpdatePasswordModal from '@/components/UpdatePasswordModal';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import type { Session } from 'next-auth';

interface DashboardContentProps {
  session: Session;
}

export default function DashboardContent({ session }: DashboardContentProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData({
          ...session.user,
          ...data
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      // Re-fetch user data to get updated profile
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch updated user data');
      }
      
      const data = await response.json();
      setUserData({
        ...session.user,
        ...data
      });
    } catch (err) {
      console.error('Error updating profile data:', err);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard berdasarkan role
  const renderDashboard = () => {
    switch (session.user.role) {
      case 'individu':
      case 'perusahaan':
        return (
          <KlienDashboard
            userData={userData}
            onUpdatePassword={() => setShowPasswordModal(true)}
            onUpdateProfile={() => setShowProfileModal(true)}
          />
        );
      case 'front-desk':
        return (
          <FrontDeskDashboard
            userData={userData}
            onUpdatePassword={() => setShowPasswordModal(true)}
            onUpdateProfile={() => setShowProfileModal(true)}
          />
        );
      case 'dokter-hewan':
        return (
          <DokterHewanDashboard
            userData={userData}
            onUpdatePassword={() => setShowPasswordModal(true)}
            onUpdateProfile={() => setShowProfileModal(true)}
          />
        );
      case 'perawat-hewan':
        return (
          <PerawatHewanDashboard
            userData={userData}
            onUpdatePassword={() => setShowPasswordModal(true)}
            onUpdateProfile={() => setShowProfileModal(true)}
          />
        );
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Selamat Datang di PetClinic</h2>
            <p className="text-gray-600">Role pengguna tidak teridentifikasi.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">PetClinic Dashboard</h1>
          <a
            href="/api/auth/signout"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-shadow text-center"
          >
            Logout
          </a>
        </div>

        {userData && renderDashboard()}

        {/* Modals */}
        {showPasswordModal && (
            <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />
          )}

        {showProfileModal && userData && (
          <UpdateProfileModal
            onClose={() => {
              setShowProfileModal(false);
              handleProfileUpdate();
            }}
            userData={userData}
            userRole={session.user.role}
          />
        )}
      </div>
    </div>
  );
}