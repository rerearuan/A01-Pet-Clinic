'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Pet Clinic</h1>
        <p className="text-gray-500 text-lg">Your trusted veterinary partner</p>
      </div>
      <div className="flex space-x-6">
        <button
          onClick={() => router.push('/login')}
          className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/register')}
          className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
