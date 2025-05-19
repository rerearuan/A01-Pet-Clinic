// 'use client';

// import { useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';

// export default function RegisterRolePage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [alamat, setAlamat] = useState('');
//   const [nomorTelepon, setNomorTelepon] = useState('');
//   const [namaDepan, setNamaDepan] = useState('');
//   const [namaTengah, setNamaTengah] = useState('');
//   const [namaBelakang, setNamaBelakang] = useState('');
//   const [namaPerusahaan, setNamaPerusahaan] = useState('');
//   const [noIzinPraktik, setNoIzinPraktik] = useState('');
//   const [tanggalMulaiKerja, setTanggalMulaiKerja] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const params = useParams();
//   const role = params.role as string;

//   const validRoles = ['front-desk', 'dokter-hewan', 'perawat-hewan', 'individu', 'perusahaan'];
//   if (!validRoles.includes(role)) {
//     return <div>Invalid role</div>;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const body = {
//       email,
//       password,
//       alamat,
//       nomor_telepon: nomorTelepon,
//       role,
//       nama_depan: namaDepan || undefined,
//       nama_tengah: namaTengah || undefined,
//       nama_belakang: namaBelakang || undefined,
//       nama_perusahaan: namaPerusahaan || undefined,
//       no_izin_praktik: noIzinPraktik || undefined,
//       tanggal_mulai_kerja: tanggalMulaiKerja || undefined
//     };

//     const res = await fetch('/api/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body)
//     });

//     const data = await res.json();
//     if (res.ok) {
//       router.push('/login');
//     } else {
//       setError(data.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow p-8">
//         <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register as {role}</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">Alamat</label>
//             <textarea
//               id="alamat"
//               value={alamat}
//               onChange={(e) => setAlamat(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
//             <input
//               id="nomorTelepon"
//               type="tel"
//               value={nomorTelepon}
//               onChange={(e) => setNomorTelepon(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//               required
//             />
//           </div>
//           {role === 'individu' && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="namaDepan" className="block text-sm font-medium text-gray-700">Nama Depan</label>
//                 <input
//                   id="namaDepan"
//                   type="text"
//                   value={namaDepan}
//                   onChange={(e) => setNamaDepan(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="namaTengah" className="block text-sm font-medium text-gray-700">Nama Tengah</label>
//                 <input
//                   id="namaTengah"
//                   type="text"
//                   value={namaTengah}
//                   onChange={(e) => setNamaTengah(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="namaBelakang" className="block text-sm font-medium text-gray-700">Nama Belakang</label>
//                 <input
//                   id="namaBelakang"
//                   type="text"
//                   value={namaBelakang}
//                   onChange={(e) => setNamaBelakang(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                   required
//                 />
//               </div>
//             </>
//           )}
//           {role === 'perusahaan' && (
//             <div className="mb-4">
//               <label htmlFor="namaPerusahaan" className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
//               <input
//                 id="namaPerusahaan"
//                 type="text"
//                 value={namaPerusahaan}
//                 onChange={(e) => setNamaPerusahaan(e.target.value)}
//                 className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                 required
//               />
//             </div>
//           )}
//           {['dokter-hewan', 'perawat-hewan'].includes(role) && (
//             <>
//               <div className="mb-4">
//                 <label htmlFor="noIzinPraktik" className="block text-sm font-medium text-gray-700">No Izin Praktik</label>
//                 <input
//                   id="noIzinPraktik"
//                   type="text"
//                   value={noIzinPraktik}
//                   onChange={(e) => setNoIzinPraktik(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="tanggalMulaiKerja" className="block text-sm font-medium text-gray-700">Tanggal Mulai Kerja</label>
//                 <input
//                   id="tanggalMulaiKerja"
//                   type="date"
//                   value={tanggalMulaiKerja}
//                   onChange={(e) => setTanggalMulaiKerja(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
//                   required
//                 />
//               </div>
//             </>
//           )}
//           <button
//             type="submit"
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-shadow"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Define interfaces for structured data
interface Sertifikat {
  noSertifikat: string;
  namaSertifikat: string;
}

interface JadwalPraktik {
  hari: string;
  jam: string;
}

// Define valid roles as a union type
type Role = 'front-desk' | 'dokter-hewan' | 'perawat-hewan' | 'individu' | 'perusahaan';

export default function RegisterRolePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [namaDepan, setNamaDepan] = useState('');
  const [namaTengah, setNamaTengah] = useState('');
  const [namaBelakang, setNamaBelakang] = useState('');
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [noIzinPraktik, setNoIzinPraktik] = useState('');
  const [tanggalMulaiKerja, setTanggalMulaiKerja] = useState('');
  const [sertifikat, setSertifikat] = useState<Sertifikat[]>([{ noSertifikat: '', namaSertifikat: '' }]);
  const [jadwalPraktik, setJadwalPraktik] = useState<JadwalPraktik[]>([{ hari: 'Senin', jam: '' }]);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const role = params.role as Role;

  const validRoles: Role[] = ['front-desk', 'dokter-hewan', 'perawat-hewan', 'individu', 'perusahaan'];
  if (!validRoles.includes(role)) {
    return <div>Invalid role</div>;
  }

  const tambahSertifikat = () => {
    setSertifikat([...sertifikat, { noSertifikat: '', namaSertifikat: '' }]);
  };

  const tambahJadwal = () => {
    setJadwalPraktik([...jadwalPraktik, { hari: 'Senin', jam: '' }]);
  };

  const updateSertifikat = (index: number, field: keyof Sertifikat, value: string) => {
    const newSertifikat = [...sertifikat];
    newSertifikat[index][field] = value;
    setSertifikat(newSertifikat);
  };

  const updateJadwal = (index: number, field: keyof JadwalPraktik, value: string) => {
    const newJadwal = [...jadwalPraktik];
    newJadwal[index][field] = value;
    setJadwalPraktik(newJadwal);
  };

  const roleTitle: Record<Role, string> = {
    'front-desk': 'Front-Desk Officer',
    'dokter-hewan': 'Dokter Hewan',
    'perawat-hewan': 'Perawat Hewan',
    individu: 'Klien - Individu',
    perusahaan: 'Klien - Perusahaan',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi berdasarkan role
    if (role === 'individu' && (!namaDepan || !namaBelakang)) {
      setError('Nama depan dan belakang diperlukan untuk individu');
      return;
    }

    if (role === 'perusahaan' && !namaPerusahaan) {
      setError('Nama perusahaan diperlukan untuk perusahaan');
      return;
    }

    if (['dokter-hewan', 'perawat-hewan', 'front-desk'].includes(role) && !tanggalMulaiKerja) {
      setError('Tanggal mulai kerja diperlukan');
      return;
    }

    if (['dokter-hewan', 'perawat-hewan'].includes(role) && !noIzinPraktik) {
      setError('No izin praktik diperlukan untuk tenaga medis');
      return;
    }

    const body = {
      email,
      password,
      alamat,
      nomor_telepon: nomorTelepon,
      role,
      nama_depan: namaDepan || undefined,
      nama_tengah: namaTengah || undefined,
      nama_belakang: namaBelakang || undefined,
      nama_perusahaan: namaPerusahaan || undefined,
      no_izin_praktik: noIzinPraktik || undefined,
      tanggal_mulai_kerja: tanggalMulaiKerja || undefined,
      sertifikat: sertifikat.filter((s) => s.noSertifikat && s.namaSertifikat),
      jadwal_praktik: role === 'dokter-hewan' ? jadwalPraktik.filter((j) => j.jam) : undefined,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">FORM REGISTER</h1>
        <h2 className="text-xl text-gray-800 mb-6 text-center">{roleTitle[role]}</h2>

        {['dokter-hewan', 'perawat-hewan'].includes(role) && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-1">Informasi Umum</h3>
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {['dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div className="mb-4">
              <label htmlFor="noIzinPraktik" className="block text-sm font-medium text-gray-700">
                Nomor Izin Praktik <span className="text-red-500">*</span>
              </label>
              <input
                id="noIzinPraktik"
                type="text"
                value={noIzinPraktik}
                onChange={(e) => setNoIzinPraktik(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              id="nomorTelepon"
              type="tel"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {['front-desk', 'dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div className="mb-4">
              <label htmlFor="tanggalMulaiKerja" className="block text-sm font-medium text-gray-700">
                Tanggal Diterima <span className="text-red-500">*</span>
              </label>
              <input
                id="tanggalMulaiKerja"
                type="date"
                value={tanggalMulaiKerja}
                onChange={(e) => setTanggalMulaiKerja(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
              rows={3}
            />
          </div>

          {role === 'individu' && (
            <>
              <div className="mb-4">
                <label htmlFor="namaDepan" className="block text-sm font-medium text-gray-700">
                  Nama Depan <span className="text-red-500">*</span>
                </label>
                <input
                  id="namaDepan"
                  type="text"
                  value={namaDepan}
                  onChange={(e) => setNamaDepan(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="namaTengah" className="block text-sm font-medium text-gray-700">
                  Nama Tengah
                </label>
                <input
                  id="namaTengah"
                  type="text"
                  value={namaTengah}
                  onChange={(e) => setNamaTengah(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="namaBelakang" className="block text-sm font-medium text-gray-700">
                  Nama Belakang <span className="text-red-500">*</span>
                </label>
                <input
                  id="namaBelakang"
                  type="text"
                  value={namaBelakang}
                  onChange={(e) => setNamaBelakang(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </>
          )}

          {role === 'perusahaan' && (
            <div className="mb-4">
              <label htmlFor="namaPerusahaan" className="block text-sm font-medium text-gray-700">
                Nama Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                id="namaPerusahaan"
                type="text"
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}

          {['dokter-hewan', 'perawat-hewan'].includes(role) && (
            <div className="mb-6 mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-gray-700 border-b pb-1">Kompetensi</h3>
              </div>

              {sertifikat.map((cert, index) => (
                <div key={index} className="mb-4 p-3 border rounded-md bg-gray-50">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nomor Sertifikat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.noSertifikat}
                      onChange={(e) => updateSertifikat(index, 'noSertifikat', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required={index === 0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Sertifikat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.namaSertifikat}
                      onChange={(e) => updateSertifikat(index, 'namaSertifikat', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required={index === 0}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={tambahSertifikat}
                className="flex items-center justify-center mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
              >
                <span className="mr-1">+</span> Tambah Sertifikat
              </button>
            </div>
          )}

          {role === 'dokter-hewan' && (
            <div className="mb-6 mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-gray-700 border-b pb-1">Jadwal Praktik</h3>
              </div>

              {jadwalPraktik.map((jadwal, index) => (
                <div key={index} className="mb-4 p-3 border rounded-md bg-gray-50">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Hari <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={jadwal.hari}
                      onChange={(e) => updateJadwal(index, 'hari', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required={index === 0}
                    >
                      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((hari) => (
                        <option key={hari} value={hari}>
                          {hari}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={jadwal.jam}
                      placeholder="Contoh: 08:00-12:00"
                      onChange={(e) => updateJadwal(index, 'jam', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required={index === 0}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={tambahJadwal}
                className="flex items-center justify-center mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
              >
                <span className="mr-1">+</span> Tambah Jadwal
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
