'use client';

import { useState } from 'react';

type Client = {
  id: string;
  name: string;
  email: string;
  type: 'Individu' | 'Perusahaan';
  address: string;
  phone: string;
  registrationDate: string;
  pets: Pet[];
};

type Pet = {
  name: string;
  type: string;
  birthDate: string;
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
    pets: [
      { name: 'Muezza', type: 'Anjing', birthDate: '2021-03-12' },
    ],
  },
  {
    id: 'e8be1fc0-1229-4b6b-b49d-34201369e92c',
    name: 'GlobalTech Innovations',
    email: 'contact@globaltechinnovations.com',
    type: 'Perusahaan',
    address: 'Jalan Pelajar Pejuang No. 29, Parepare, Kalimantan Utara 28407',
    phone: '0877239988707',
    registrationDate: '2023-12-05',
    pets: [
      { name: 'Shadow', type: 'Burung', birthDate: '2021-07-11' },
    ],
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
              <button className="bg-black text-white px-4 rounded-r-lg">
                🔍
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="py-4 px-6 text-center">No</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Nama</th>
                    <th className="py-4 px-6">Jenis</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients
                    .filter(client => client.name.toLowerCase().includes(search.toLowerCase()))
                    .map((client, index) => (
                      <tr key={client.id} className="border-t hover:bg-gray-50">
                        <td className="py-5 px-6 text-center">{index + 1}</td>
                        <td className="py-5 px-6">{client.email}</td>
                        <td className="py-5 px-6">{client.name}</td>
                        <td className="py-5 px-6">{client.type}</td>
                        <td className="py-5 px-6 flex justify-center">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-xs font-semibold"
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
              className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              ← Back to List
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detail Client</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div><b>Nomor Identitas</b>: {selectedClient.id}</div>
              <div><b>{selectedClient.type === 'Individu' ? 'Nama Lengkap' : 'Nama Perusahaan'}</b>: {selectedClient.name}</div>
              <div><b>Alamat</b>: {selectedClient.address}</div>
              <div><b>Nomor Telepon</b>: {selectedClient.phone}</div>
              <div><b>Email</b>: {selectedClient.email}</div>
            </div>

            {/* Pet List */}
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Daftar Hewan Peliharaan</h3>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide text-xs">
                <tr>
                    <th className="py-4 px-6 border-b text-center">No</th>
                    <th className="py-4 px-6 border-b text-center">Nama</th>
                    <th className="py-4 px-6 border-b text-center">Jenis</th>
                    <th className="py-4 px-6 border-b text-center">Tanggal Lahir</th>
                </tr>
                </thead>
                <tbody>
                {selectedClient.pets.map((pet, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                    <td className="py-5 px-6 border-b text-center">{index + 1}</td>
                    <td className="py-5 px-6 border-b text-center">{pet.name}</td>
                    <td className="py-5 px-6 border-b text-center">{pet.type}</td>
                    <td className="py-5 px-6 border-b text-center">{pet.birthDate}</td>
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
