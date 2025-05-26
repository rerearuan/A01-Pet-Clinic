import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        k.no_identitas AS id,
        u.email,
        -- Nama lengkap untuk individu, fallback ke nama perusahaan jika null
        CASE
          WHEN i.no_identitas_klien IS NOT NULL THEN
            TRIM(
              COALESCE(i.nama_depan, '') || ' ' ||
              COALESCE(i.nama_tengah || ' ', '') || 
              COALESCE(i.nama_belakang, '')
            )
          WHEN p.no_identitas_klien IS NOT NULL THEN
            p.nama_perusahaan
          ELSE ''
        END AS name,
        -- Jenis klien
        CASE
          WHEN i.no_identitas_klien IS NOT NULL THEN 'Individu'
          WHEN p.no_identitas_klien IS NOT NULL THEN 'Perusahaan'
          ELSE 'Tidak Diketahui'
        END AS type,
        u.alamat AS address,
        u.nomor_telepon AS phone,
        k.tanggal_registrasi AS registrationDate
      FROM KLIEN k
      JOIN "USER" u ON k.email = u.email
      LEFT JOIN INDIVIDU i ON i.no_identitas_klien = k.no_identitas
      LEFT JOIN PERUSAHAAN p ON p.no_identitas_klien = k.no_identitas
      ORDER BY k.tanggal_registrasi DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
