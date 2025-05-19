import { NextResponse } from 'next/server';
import pool from '@/lib/db/';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const role = session.user.role;

    console.log('Session email:', email, 'Role:', role);

    const userQuery = await pool.query('SELECT email, alamat, nomor_telepon FROM "USER" WHERE email = $1', [email]);

    if (userQuery.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userQuery.rows[0];

    if (role === 'individu' || role === 'perusahaan') {
      const klienQuery = await pool.query('SELECT no_identitas, tanggal_registrasi FROM KLIEN WHERE email = $1', [email]);
      console.log('Klien query result:', klienQuery.rows);

      if (klienQuery.rows.length > 0) {
        const klienData = klienQuery.rows[0];
        Object.assign(userData, klienData);

        if (role === 'individu') {
          const individuQuery = await pool.query(
            'SELECT nama_depan, nama_tengah, nama_belakang FROM INDIVIDU WHERE no_identitas_klien = $1',
            [klienData.no_identitas]
          );
          console.log('Individu query result:', individuQuery.rows);

          if (individuQuery.rows.length > 0) {
            Object.assign(userData, individuQuery.rows[0]);
          }
        } else if (role === 'perusahaan') {
          const perusahaanQuery = await pool.query(
            'SELECT nama_perusahaan FROM PERUSAHAAN WHERE no_identitas_klien = $1',
            [klienData.no_identitas]
          );
          console.log('Perusahaan query result:', perusahaanQuery.rows);

          if (perusahaanQuery.rows.length > 0) {
            Object.assign(userData, perusahaanQuery.rows[0]);
          }
        }
      }
    } else if (role === 'front-desk' || role === 'dokter-hewan' || role === 'perawat-hewan') {
      const pegawaiQuery = await pool.query(
        'SELECT no_pegawai, tanggal_mulai_kerja, tanggal_akhir_kerja FROM PEGAWAI WHERE email_user = $1',
        [email]
      );

      if (pegawaiQuery.rows.length > 0) {
        const pegawaiData = pegawaiQuery.rows[0];
        Object.assign(userData, pegawaiData);

        const noPegawai = pegawaiData.no_pegawai;

        if (role === 'dokter-hewan' || role === 'perawat-hewan') {
          const tenagaMedisQuery = await pool.query(
            'SELECT no_izin_praktik FROM TENAGA_MEDIS WHERE no_tenaga_medis = $1',
            [noPegawai]
          );

          if (tenagaMedisQuery.rows.length > 0) {
            Object.assign(userData, tenagaMedisQuery.rows[0]);

            const sertifikatQuery = await pool.query(
              'SELECT no_sertifikat_kompetensi AS "nomorSertifikat", nama_sertifikat AS "namaSertifikat" FROM SERTIFIKAT_KOMPETENSI WHERE no_tenaga_medis = $1',
              [noPegawai]
            );

            userData.sertifikat = sertifikatQuery.rows;

            if (role === 'dokter-hewan') {
              const jadwalQuery = await pool.query(
                'SELECT hari, jam FROM JADWAL_PRAKTIK WHERE no_dokter_hewan = $1',
                [noPegawai]
              );

              userData.jadwalPraktik = jadwalQuery.rows;
            }
          }
        }
      }
    }

    console.log('Final userData returned:', userData); // Log the final response
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

