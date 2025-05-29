import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import pool from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT
        k.no_identitas AS id,
        u.email,
        k.tanggal_registrasi,
        u.alamat,
        u.nomor_telepon,
        i.nama_depan,
        i.nama_tengah,
        i.nama_belakang,
        p.nama_perusahaan,
        CASE
          WHEN i.no_identitas_klien IS NOT NULL THEN 'Individu'
          WHEN p.no_identitas_klien IS NOT NULL THEN 'Perusahaan'
          ELSE 'Tidak Diketahui'
        END AS type
      FROM KLIEN k
      JOIN "USER" u ON k.email = u.email
      LEFT JOIN INDIVIDU i ON i.no_identitas_klien = k.no_identitas
      LEFT JOIN PERUSAHAAN p ON p.no_identitas_klien = k.no_identitas
      WHERE u.email = $1
      LIMIT 1
    `, [email]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const client = result.rows[0];

    // ✅ FIXED: JOIN JENIS_HEWAN
    const petsResult = await pool.query(`
      SELECT h.nama, j.nama_jenis AS jenis, h.tanggal_lahir
      FROM HEWAN h
      JOIN JENIS_HEWAN j ON h.id_jenis = j.id
      WHERE h.no_identitas_klien = $1
      ORDER BY h.tanggal_lahir DESC
    `, [client.id]);

    const formatted = {
      id: client.id,
      email: client.email,
      address: client.alamat,
      phone: client.nomor_telepon,
      registrationDate: client.tanggal_registrasi?.toISOString()?.split('T')[0] ?? null,
      type: client.type,
      name: client.type === 'Individu'
        ? `${client.nama_depan ?? ''} ${client.nama_tengah ?? ''} ${client.nama_belakang ?? ''}`.trim()
        : client.nama_perusahaan,
      pets: petsResult.rows.map((p: any, i: number) => ({
        no: i + 1,
        name: p.nama,
        type: p.jenis,
        birthDate: p.tanggal_lahir?.toISOString()?.split('T')[0] ?? null
      }))
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching client detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
