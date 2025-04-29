'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simpan ke localStorage kalau mau, terserah
    localStorage.setItem('isAuthenticated', 'true');
    
    // Setelah klik login, baru redirect
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/background.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-gray-500 text-sm">Login to your Pet Clinic account</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition"
              >
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
