// // import { NextResponse } from 'next/server';
// // import bcrypt from 'bcrypt';
// // import { v4 as uuidv4 } from 'uuid';
// // import pool from '../../../lib/db/';

// // export async function POST(req: Request) {
// //   const { email, password, alamat, nomor_telepon, role, nama_depan, nama_tengah, nama_belakang, nama_perusahaan, no_izin_praktik, tanggal_mulai_kerja } = await req.json();
// //   const validRoles = ['front-desk', 'dokter-hewan', 'perawat-hewan', 'individu', 'perusahaan'];

// //   if (!email || !password || !alamat || !nomor_telepon || !role) {
// //     return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
// //   }

// //   if (!validRoles.includes(role)) {
// //     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
// //   }

// //   if (role === 'individu' && (!nama_depan || !nama_belakang)) {
// //     return NextResponse.json({ error: 'Nama depan dan belakang diperlukan untuk individu' }, { status: 400 });
// //   }

// //   if (role === 'perusahaan' && !nama_perusahaan) {
// //     return NextResponse.json({ error: 'Nama perusahaan diperlukan untuk perusahaan' }, { status: 400 });
// //   }

// //   if (['dokter-hewan', 'perawat-hewan'].includes(role) && (!no_izin_praktik || !tanggal_mulai_kerja)) {
// //     return NextResponse.json({ error: 'No izin praktik dan tanggal mulai kerja diperlukan untuk tenaga medis' }, { status: 400 });
// //   }

// //   try {
// //     const { rows } = await pool.query('SELECT * FROM "USER" WHERE email = $1', [email]);
// //     if (rows.length > 0) {
// //       return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     await pool.query('BEGIN');

// //     // Insert ke USER
// //     await pool.query(
// //       'INSERT INTO "USER" (email, password, alamat, nomor_telepon) VALUES ($1, $2, $3, $4)',
// //       [email, hashedPassword, alamat, nomor_telepon]
// //     );

// //     if (['front-desk', 'dokter-hewan', 'perawat-hewan'].includes(role)) {
// //       // Insert ke PEGAWAI
// //       const no_pegawai = uuidv4();
// //       await pool.query(
// //         'INSERT INTO PEGAWAI (no_pegawai, tanggal_mulai_kerja, email_user) VALUES ($1, $2, $3)',
// //         [no_pegawai, tanggal_mulai_kerja || new Date(), email]
// //       );

// //       if (role === 'front-desk') {
// //         // Insert ke FRONT_DESK
// //         await pool.query('INSERT INTO FRONT_DESK (no_front_desk) VALUES ($1)', [no_pegawai]);
// //       } else {
// //         // Insert ke TENAGA_MEDIS
// //         await pool.query(
// //           'INSERT INTO TENAGA_MEDIS (no_tenaga_medis, no_izin_praktik) VALUES ($1, $2)',
// //           [no_pegawai, no_izin_praktik]
// //         );       

// //         if (role === 'dokter-hewan') {
// //           // Insert ke DOKTER_HEWAN
// //           await pool.query('INSERT INTO DOKTER_HEWAN (no_dokter_hewan) VALUES ($1)', [no_pegawai]);
// //         } else if (role === 'perawat-hewan') {
// //           // Insert ke PERAWAT_HEWAN
// //           await pool.query('INSERT INTO PERAWAT_HEWAN (no_perawat_hewan) VALUES ($1)', [no_pegawai]);

// //         }
// //       }
// //     } else {
// //       // Insert ke KLIEN
// //       const no_identitas = uuidv4();
// //       await pool.query(
// //         'INSERT INTO KLIEN (no_identitas, tanggal_registrasi, email) VALUES ($1, $2, $3)',
// //         [no_identitas, new Date(), email]
// //       );

// //       if (role === 'individu') {
// //         // Insert ke INDIVIDU
// //         await pool.query(
// //           'INSERT INTO INDIVIDU (no_identitas_klien, nama_depan, nama_tengah, nama_belakang) VALUES ($1, $2, $3, $4)',
// //           [no_identitas, nama_depan, nama_tengah, nama_belakang]
// //         );
// //       } else if (role === 'perusahaan') {
// //         // Insert ke PERUSAHAAN
// //         await pool.query(
// //           'INSERT INTO PERUSAHAAN (no_identitas_klien, nama_perusahaan) VALUES ($1, $2)',
// //           [no_identitas, nama_perusahaan]
// //         );
// //       }
// //     }

// //     await pool.query('COMMIT');
// //     return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
// //   } catch (error) {
// //     await pool.query('ROLLBACK');
// //     console.error(error);
// //     return NextResponse.json({ error: 'Server error' }, { status: 500 });
// //   }
// // }
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
// import pool from '../../../lib/db/';

// export async function POST(req: Request) {
//   const { email, password, alamat, nomor_telepon, role, nama_depan, nama_tengah, nama_belakang, nama_perusahaan, no_izin_praktik, tanggal_mulai_kerja } = await req.json();
//   const validRoles = ['front-desk', 'dokter-hewan', 'perawat-hewan', 'individu', 'perusahaan'];

//   if (!email || !password || !alamat || !nomor_telepon || !role) {
//     return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
//   }

//   if (!validRoles.includes(role)) {
//     return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//   }

//   if (role === 'individu' && (!nama_depan || !nama_belakang)) {
//     return NextResponse.json({ error: 'Nama depan dan belakang diperlukan untuk individu' }, { status: 400 });
//   }

//   if (role === 'perusahaan' && !nama_perusahaan) {
//     return NextResponse.json({ error: 'Nama perusahaan diperlukan untuk perusahaan' }, { status: 400 });
//   }

//   if (['dokter-hewan', 'perawat-hewan'].includes(role) && (!no_izin_praktik || !tanggal_mulai_kerja)) {
//     return NextResponse.json({ error: 'No izin praktik dan tanggal mulai kerja diperlukan untuk tenaga medis' }, { status: 400 });
//   }

//   try {
//     // Validasi email (case-insensitive)
//     const { rows } = await pool.query('SELECT * FROM "USER" WHERE LOWER(email) = LOWER($1)', [email]);
//     if (rows.length > 0) {
//       return NextResponse.json({ 
//         error: `Error: Email "${email}" sudah terdaftar, gunakan email lain.` 
//       }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await pool.query('BEGIN');

//     // Insert ke USER
//     await pool.query(
//       'INSERT INTO "USER" (email, password, alamat, nomor_telepon) VALUES ($1, $2, $3, $4)',
//       [email, hashedPassword, alamat, nomor_telepon]
//     );

//     if (['front-desk', 'dokter-hewan', 'perawat-hewan'].includes(role)) {
//       // Insert ke PEGAWAI
//       const no_pegawai = uuidv4();
//       await pool.query(
//         'INSERT INTO PEGAWAI (no_pegawai, tanggal_mulai_kerja, email_user) VALUES ($1, $2, $3)',
//         [no_pegawai, tanggal_mulai_kerja || new Date(), email]
//       );

//       if (role === 'front-desk') {
//         // Insert ke FRONT_DESK
//         await pool.query('INSERT INTO FRONT_DESK (no_front_desk) VALUES ($1)', [no_pegawai]);
//       } else {
//         // Insert ke TENAGA_MEDIS
//         await pool.query(
//           'INSERT INTO TENAGA_MEDIS (no_tenaga_medis, no_izin_praktik) VALUES ($1, $2)',
//           [no_pegawai, no_izin_praktik]
//         );       

//         if (role === 'dokter-hewan') {
//           // Insert ke DOKTER_HEWAN
//           await pool.query('INSERT INTO DOKTER_HEWAN (no_dokter_hewan) VALUES ($1)', [no_pegawai]);
//         } else if (role === 'perawat-hewan') {
//           // Insert ke PERAWAT_HEWAN
//           await pool.query('INSERT INTO PERAWAT_HEWAN (no_perawat_hewan) VALUES ($1)', [no_pegawai]);
//         }
//       }
//     } else {
//       // Insert ke KLIEN
//       const no_identitas = uuidv4();
//       await pool.query(
//         'INSERT INTO KLIEN (no_identitas, tanggal_registrasi, email) VALUES ($1, $2, $3)',
//         [no_identitas, new Date(), email]
//       );

//       if (role === 'individu') {
//         // Insert ke INDIVIDU
//         await pool.query(
//           'INSERT INTO INDIVIDU (no_identitas_klien, nama_depan, nama_tengah, nama_belakang) VALUES ($1, $2, $3, $4)',
//           [no_identitas, nama_depan, nama_tengah || '', nama_belakang]
//         );
//       } else if (role === 'perusahaan') {
//         // Insert ke PERUSAHAAN
//         await pool.query(
//           'INSERT INTO PERUSAHAAN (no_identitas_klien, nama_perusahaan) VALUES ($1, $2)',
//           [no_identitas, nama_perusahaan]
//         );
//       }
//     }

//     await pool.query('COMMIT');
//     return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
//   } catch (error) {
//     await pool.query('ROLLBACK');
//     console.error(error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../../lib/db/';

export async function POST(req: Request) {
  try {
    const { 
      email, 
      password, 
      alamat, 
      nomor_telepon, 
      role, 
      nama_depan, 
      nama_tengah, 
      nama_belakang, 
      nama_perusahaan, 
      no_izin_praktik, 
      tanggal_mulai_kerja,
      sertifikat,
      jadwal_praktik
    } = await req.json();
    
    const validRoles = ['front-desk', 'dokter-hewan', 'perawat-hewan', 'individu', 'perusahaan'];

    // Validasi input dasar
    if (!email || !password || !alamat || !nomor_telepon || !role) {
      return NextResponse.json({ error: 'Semua field yang wajib harus diisi' }, { status: 400 });
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
    }

    // Validasi berdasarkan role
    if (role === 'individu' && (!nama_depan || !nama_belakang)) {
      return NextResponse.json({ error: 'Nama depan dan belakang diperlukan untuk individu' }, { status: 400 });
    }

    if (role === 'perusahaan' && !nama_perusahaan) {
      return NextResponse.json({ error: 'Nama perusahaan diperlukan untuk perusahaan' }, { status: 400 });
    }

    if (['dokter-hewan', 'perawat-hewan'].includes(role) && (!no_izin_praktik || !tanggal_mulai_kerja)) {
      return NextResponse.json({ error: 'No izin praktik dan tanggal mulai kerja diperlukan untuk tenaga medis' }, { status: 400 });
    }

    if (role === 'front-desk' && !tanggal_mulai_kerja) {
      return NextResponse.json({ error: 'Tanggal mulai kerja diperlukan untuk front desk' }, { status: 400 });
    }

    try {
      // Validasi email (case-insensitive)
      const { rows } = await pool.query('SELECT * FROM "USER" WHERE LOWER(email) = LOWER($1)', [email]);
      if (rows.length > 0) {
        return NextResponse.json({ 
          error: `Error: Email "${email}" sudah terdaftar, gunakan email lain.` 
        }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('BEGIN');

      // Insert ke USER
      await pool.query(
        'INSERT INTO "USER" (email, password, alamat, nomor_telepon) VALUES ($1, $2, $3, $4)',
        [email, hashedPassword, alamat, nomor_telepon]
      );

      if (['front-desk', 'dokter-hewan', 'perawat-hewan'].includes(role)) {
        // Insert ke PEGAWAI
        const no_pegawai = uuidv4();
        await pool.query(
          'INSERT INTO PEGAWAI (no_pegawai, tanggal_mulai_kerja, email_user) VALUES ($1, $2, $3)',
          [no_pegawai, tanggal_mulai_kerja, email]
        );

        if (role === 'front-desk') {
          // Insert ke FRONT_DESK
          await pool.query('INSERT INTO FRONT_DESK (no_front_desk) VALUES ($1)', [no_pegawai]);
        } else {
          // Insert ke TENAGA_MEDIS
          await pool.query(
            'INSERT INTO TENAGA_MEDIS (no_tenaga_medis, no_izin_praktik) VALUES ($1, $2)',
            [no_pegawai, no_izin_praktik]
          );       

          // Tambahkan Sertifikat Kompetensi jika ada
          if (sertifikat && Array.isArray(sertifikat)) {
            for (const cert of sertifikat) {
              if (cert.noSertifikat && cert.namaSertifikat) {
                await pool.query(
                  'INSERT INTO SERTIFIKAT_KOMPETENSI (no_sertifikat_kompetensi, no_tenaga_medis, nama_sertifikat) VALUES ($1, $2, $3)',
                  [cert.noSertifikat, no_pegawai, cert.namaSertifikat]
                );
              }
            }
          }

          if (role === 'dokter-hewan') {
            // Insert ke DOKTER_HEWAN
            await pool.query('INSERT INTO DOKTER_HEWAN (no_dokter_hewan) VALUES ($1)', [no_pegawai]);

            // Tambahkan jadwal praktik jika ada
            if (jadwal_praktik && Array.isArray(jadwal_praktik)) {
              for (const jadwal of jadwal_praktik) {
                if (jadwal.hari && jadwal.jam) {
                  await pool.query(
                    'INSERT INTO JADWAL_PRAKTIK (no_dokter_hewan, hari, jam) VALUES ($1, $2, $3)',
                    [no_pegawai, jadwal.hari, jadwal.jam]
                  );
                }
              }
            }
          } else if (role === 'perawat-hewan') {
            // Insert ke PERAWAT_HEWAN
            await pool.query('INSERT INTO PERAWAT_HEWAN (no_perawat_hewan) VALUES ($1)', [no_pegawai]);
          }
        }
      } else {
        // Insert ke KLIEN
        const no_identitas = uuidv4();
        await pool.query(
          'INSERT INTO KLIEN (no_identitas, tanggal_registrasi, email) VALUES ($1, $2, $3)',
          [no_identitas, new Date(), email]
        );

        if (role === 'individu') {
          // Insert ke INDIVIDU
          await pool.query(
            'INSERT INTO INDIVIDU (no_identitas_klien, nama_depan, nama_tengah, nama_belakang) VALUES ($1, $2, $3, $4)',
            [no_identitas, nama_depan, nama_tengah || '', nama_belakang]
          );
        } else if (role === 'perusahaan') {
          // Insert ke PERUSAHAAN
          await pool.query(
            'INSERT INTO PERUSAHAAN (no_identitas_klien, nama_perusahaan) VALUES ($1, $2)',
            [no_identitas, nama_perusahaan]
          );
        }
      }

      await pool.query('COMMIT');
      return NextResponse.json({ message: 'Pendaftaran berhasil!' }, { status: 201 });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Terjadi kesalahan server. Silakan coba lagi.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat memproses permintaan' }, { status: 400 });
  }
}