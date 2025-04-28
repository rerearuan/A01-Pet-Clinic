'use client';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pet Clinic Dashboard</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <main className="flex-grow p-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Doctor!</h2>
          <p className="text-gray-600 mb-6">
            Ini adalah halaman dashboard anda. Anda dapat mengelola vaksinasi, pasien, dan data lainnya dari sini.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold text-gray-700 mb-2">Total Vaksinasi</h3>
              <p className="text-2xl font-bold text-blue-600">120</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold text-gray-700 mb-2">Pasien Terdaftar</h3>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
