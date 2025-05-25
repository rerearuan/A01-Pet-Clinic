'use client';

import { useEffect, useState } from 'react';

interface VaccineData {
  pet_name: string;
  vaccine_name: string;
  vaccine_code: string;
  harga: number;
  timestamp_awal: string;
}

export default function VaccinesClientPage() {
  const [data, setData] = useState<VaccineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedPet) params.append('pet', selectedPet);
        if (selectedVaccine) params.append('vaccine', selectedVaccine);
        const res = await fetch(`/api/vaccines-client?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching vaccines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, [selectedPet, selectedVaccine]);

  const petOptions = Array.from(new Set(data.map((d) => d.pet_name)));
  const vaccineOptions = Array.from(new Set(data.map((d) => d.vaccine_name)));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
      <h1 className="text-3xl font-bold text-orange-500 mb-10">List Vaccine for Client's Pet</h1>

      <div className="flex justify-end gap-4 mb-6">
        <select
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
          className="border border-orange-400 text-sm px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Filter by Pet</option>
          {petOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={selectedVaccine}
          onChange={(e) => setSelectedVaccine(e.target.value)}
          className="border border-orange-400 text-sm px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Filter by Vaccine</option>
          {vaccineOptions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-center text-gray-700">
          <thead className="bg-gray-100 font-semibold text-gray-800">
            <tr>
              <th className="py-3 border-b">No</th>
              <th className="py-3 border-b">Pet</th>
              <th className="py-3 border-b">Vaksin</th>
              <th className="py-3 border-b">ID Vaksin</th>
              <th className="py-3 border-b">Harga</th>
              <th className="py-3 border-b">Time and Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-6 text-gray-500">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-gray-500">Belum ada data vaksinasi</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-orange-50 border-b last:border-b-0">
                  <td className="py-3">{i + 1}</td>
                  <td className="py-3 text-blue-600 underline">{row.pet_name}</td>
                  <td className="py-3">{row.vaccine_name}</td>
                  <td className="py-3">{row.vaccine_code}</td>
                  <td className="py-3">Rp{row.harga.toLocaleString('id-ID')}</td>
                  <td className="py-3">
                    {new Date(row.timestamp_awal).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
