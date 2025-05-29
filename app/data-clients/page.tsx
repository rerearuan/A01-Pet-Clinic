'use client';
import { useEffect, useState } from 'react';

export type Pet = {
  name: string;
  type: string;
  birthDate: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  type: 'Individu' | 'Perusahaan';
  address: string;
  phone: string;
  registrationDate: string;
  pets: Pet[];
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch('/api/data-clients');
      const data = await res.json();
      setClients(data);
    };
    fetchClients();
  }, []);

  const fetchClientDetail = async (id: string) => {
    setLoadingId(id);
    const res = await fetch(`/api/data-clients/${id}`);
    const data = await res.json();
    setSelectedClient(data);
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
        {!selectedClient && (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">List Client</h1>
            </div>

            <div className="flex">
              <input
                type="text"
                placeholder="Search Client Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-l-lg p-3 w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-orange-500 text-white px-4 rounded-r-lg">🔍</button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="min-w-full text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">NO</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">EMAIL</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">NAMA</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">JENIS</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients
                    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
                    .map((client, idx) => (
                      <tr key={client.id} className="hover:bg-orange-50">
                        <td className="py-5 px-6 text-center">{idx + 1}</td>
                        <td className="py-5 px-6 text-center">{client.email}</td>
                        <td className="py-5 px-6 text-center">{client.name}</td>
                        <td className="py-5 px-6 text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              client.type === 'Individu'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {client.type}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <button
                            onClick={() => fetchClientDetail(client.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
                          >
                            {loadingId === client.id ? 'Loading...' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedClient && (
          <>
            <button
              onClick={() => setSelectedClient(null)}
              className="mb-6 bg-orange-500 hover:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ← Back to List
            </button>

            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-orange-500 rounded mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">Detail Client</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div>
                <p className="font-bold text-gray-500 mb-1">Nomor Identitas</p>
                <p className="text-gray-800">{selectedClient.id}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">Alamat</p>
                <p className="text-gray-800">{selectedClient.address}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">
                  {selectedClient.type === 'Individu' ? 'Nama Lengkap' : 'Nama Perusahaan'}
                </p>
                <p className="text-gray-800">{selectedClient.name}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">Nomor Telepon</p>
                <p className="text-gray-800">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">Email</p>
                <p className="text-gray-800">{selectedClient.email}</p>
              </div>
              <div>
                <p className="font-bold text-gray-500 mb-1">Tanggal Registrasi</p>
                <p className="text-gray-800">{formatDate(selectedClient.registrationDate)}</p>
              </div>
            </div>

            <div className="flex items-center mb-6 mt-10">
              <div className="w-1 h-8 bg-orange-500 rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-gray-800">Daftar Hewan Peliharaan</h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-white">
                  <tr>
                    <th className="py-4 px-6 text-center font-bold">NO</th>
                    <th className="py-4 px-6 text-center font-bold">NAMA</th>
                    <th className="py-4 px-6 text-center font-bold">JENIS</th>
                    <th className="py-4 px-6 text-center font-bold">TANGGAL LAHIR</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClient.pets.map((pet, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-4 px-6 text-center">{idx + 1}</td>
                      <td className="py-4 px-6 text-center">{pet.name}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {pet.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">{formatDate(pet.birthDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
