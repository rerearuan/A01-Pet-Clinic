"use client";
import { useState } from 'react';

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

const dummyClients: Client[] = [
  {
    id: '4d925fd2-7ab6-4409-83c9-0c0e586d0e87',
    name: 'Emma Stone',
    email: 'emma.stone@example.com',
    type: 'Individu',
    address: 'Gang Joyoboyo No. 4, Tomohon, KS 80014',
    phone: '081268484428',
    registrationDate: '2023-03-15',
    pets: [{ name: 'Muezza', type: 'Anjing', birthDate: '2021-03-12' }],
  },
  {
    id: 'e8be1fc0-1229-4b6b-b49d-34201369e92c',
    name: 'GlobalTech Innovations',
    email: 'contact@globaltechinnovations.com',
    type: 'Perusahaan',
    address: 'Jalan Pelajar Pejuang No. 29, Parepare, Kalimantan Utara 28407',
    phone: '0877239988707',
    registrationDate: '2023-12-05',
    pets: [{ name: 'Shadow', type: 'Burung', birthDate: '2021-07-11' }],
  },
];

export default function ClientPage() {
  const [clients] = useState(dummyClients);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
        {!selectedClient && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">List Client</h1>
            </div>

            {/* Search */}
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

            {/* Table - Matching the design */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="min-w-full text-gray-700">
                {/* Header */}
                <thead className="bg-gray-50">
                <tr>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">NO</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">EMAIL</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">NAMA</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">JENIS</th>
                    <th className="py-4 px-6 text-center font-semibold text-gray-600">ACTION</th>
                </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-100">
                {clients
                    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
                    .map((client, idx) => (
                    <tr key={client.id} className="hover:bg-gray-50">
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
                            onClick={() => setSelectedClient(client)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium"
                        >
                            Detail
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
          </>
        )}

        {/* Detail Page */}
        {selectedClient && (
          <>
            <button
              onClick={() => setSelectedClient(null)}
              className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
            >
              ← Back to List
            </button>

            {/* Detail Header */}
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-orange-500 rounded mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">Detail Client</h2>
            </div>

            {/* Client Info with bold values */}
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
                  {selectedClient.type === 'Individu'
                    ? 'Nama Lengkap'
                    : 'Nama Perusahaan'}
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
                <p className="text-gray-800">{selectedClient.registrationDate}</p>
              </div>
            </div>

            {/* Pets List */}
            <div className="flex items-center mb-6 mt-10">
              <div className="w-1 h-8 bg-orange-500 rounded mr-3"></div>
              <h3 className="text-2xl font-bold text-gray-800">
                Daftar Hewan Peliharaan
              </h3>
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
                      <td className="py-4 px-6 text-center">{pet.birthDate}</td>
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
