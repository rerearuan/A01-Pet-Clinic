'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ClientNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleConfirmLogout = () => {
    // 1. Tutup modal dulu
    setShowLogoutConfirm(false);

    // 2. Delay sedikit supaya modal hilang duluan, baru hapus dan redirect
    setTimeout(() => {
      localStorage.removeItem('isAuthenticated');
      router.push('/login');
    }, 300); // kasih delay 300ms biar smooth modal close
  };

  if (!hasMounted) return null; // mencegah hydration mismatch

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              {/* SVG LOGO */}
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* path SVG logo kamu */}
              </svg>
              <span className="ml-2 text-l font-bold text-[#000000]">Pet Clinic</span>
            </div>

            {/* Hamburger button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8 h-10">
              <NavLink href="/doctor" pathname={pathname} label="Dashboard" />
              <NavLink href="/doctor/pet-types" pathname={pathname} label="Kelola Hewan Peliharaan" />
              <NavLink href="/doctor/pet_treatments" pathname={pathname} label="Daftar Kunjungan" />
            </div>

            {/* Logout Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden flex flex-col space-y-4 mt-4">
              <NavLink href="/doctor" pathname={pathname} label="Dashboard" />
              <NavLink href="/doctor/pet-types" pathname={pathname} label="Kelola Hewan Peliharaan" />
              <NavLink href="/doctor/pet_treatments" pathname={pathname} label="Daftar Kunjungan" />
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-5 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Yakin mau logout?</h2>
            <div className="flex justify-around">
              <button
                onClick={handleConfirmLogout}
                className="bg-[#FD7E14] hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Ya, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, pathname, label }: { href: string; pathname: string; label: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center h-full px-1 ${pathname === href ? "text-[#FD7E14] border-b-2 border-[#FD7E14]" : "text-gray-900 hover:text-[#FD7E14]"}`}
    >
      {label}
    </Link>
  );
}
