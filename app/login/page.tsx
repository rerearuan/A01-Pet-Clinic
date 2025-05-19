'use client';

<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
=======
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TANPA cek email/password
    localStorage.setItem('isAuthenticated', 'true');
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
=======
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      console.log('SignIn result:', result); // Debug: Periksa hasil signIn

      if (result?.error) {
        setError(result.error);
      } else if (!result?.ok) {
        setError('Login gagal. Silakan coba lagi.');
      } else {
        console.log('Redirecting to /dashboard'); // Debug: Konfirmasi redirect
        router.push('/dashboard-user');
        router.refresh(); // Refresh untuk memastikan sesi terdeteksi
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Coba lagi.');
      console.error('Login error:', err); // Debug: Tangkap error tak terduga
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-shadow disabled:bg-orange-300"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
>>>>>>> 90243197f2e4414c32dd89fb385600ebb6823363
