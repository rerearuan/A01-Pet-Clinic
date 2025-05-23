'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@petclinic.com' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      setShowLogin(false);
      router.push('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.png" // <- Ganti nama file kamu upload ke /public/background.png
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay untuk konten */}
      <div className="relative z-10 flex flex-col min-h-screen">


        {/* Hero Section */}
        <div className="flex flex-1 items-center justify-start px-16 py-20">
          <div className="max-w-2xl">
            <p className="text-orange-500 font-semibold mb-2 text-lg">Pet Shop</p>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              A pet store with <br /> everything you need
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sociis blandit et pellentesque aliquet at quisque tortor lacinia nullam. Mattis aenean scelerisque dui libero
            </p>
            <button className="bg-black text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Login to Pet Clinic</h2>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@petclinic.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
