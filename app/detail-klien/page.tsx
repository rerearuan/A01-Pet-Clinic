'use client';
import { useEffect, useState } from 'react';

type Pet = {
  name: string;
  type: string;
  birthDate: string;
};

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch('/api/detail-klien');
        if (!res.ok) throw new Error('Gagal memuat data');
        const data = await res.json();
        setClient(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, []);

  if (loading) return <div className="p-8 text-gray-700">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!client) return <div className="p-8">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-10">

        <div>
          <h1 className="text-3xl font-bold text-orange-500 mb-6">Detail Client</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500 font-medium">Nomor Identitas</p>
              <p>{client.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                {client.type === 'Individu' ? 'Nama Lengkap' : 'Nama Perusahaan'}
              </p>
              <p>{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Alamat</p>
              <p>{client.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Nomor Telepon</p>
              <p>{client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tanggal Registrasi</p>
              <p>{formatDate(client.registrationDate)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Daftar Hewan Peliharaan</h2>
          {client.pets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-orange-100 text-center">
                  <tr>
                    <th className="px-4 py-3 font-semibold">No</th>
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold">Jenis</th>
                    <th className="px-4 py-3 font-semibold">Tanggal Lahir</th>
                  </tr>
                </thead>
                <tbody>
                  {[...client.pets]
                    .sort((a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime())
                    .map((pet, index) => (
                    <tr key={index} className="border-t text-center hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{pet.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs">
                          {pet.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(pet.birthDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">Tidak ada hewan peliharaan terdaftar.</p>
          )}
        </div>

      </div>
    </div>
  );
}
