import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← params is a Promise
): Promise<NextResponse> {
  // await the params before using it
  const { id } = await params;

  try {
    const clientDetailQuery = `
      SELECT 
        k.no_identitas        AS id,
        u.email,
        u.alamat              AS address,
        u.nomor_telepon       AS phone,
        k.tanggal_registrasi  AS registration_date,
        i.nama_depan,
        i.nama_tengah,
        i.nama_belakang,
        p.nama_perusahaan,
        CASE 
          WHEN i.no_identitas_klien IS NOT NULL THEN 'Individu'
          WHEN p.no_identitas_klien IS NOT NULL THEN 'Perusahaan'
          ELSE 'Unknown'
        END AS type
      FROM klien k
      JOIN "USER" u ON k.email = u.email
      LEFT JOIN individu i ON k.no_identitas = i.no_identitas_klien
      LEFT JOIN perusahaan p ON k.no_identitas = p.no_identitas_klien
      WHERE k.no_identitas = $1
    `;

    const clientResult = await pool.query(clientDetailQuery, [id]);
    if (clientResult.rows.length === 0) {
      return new NextResponse('Client not found', { status: 404 });
    }

    const client = clientResult.rows[0];

    const petsQuery = `
      SELECT 
        h.nama          AS name,
        j.nama_jenis    AS type,
        h.tanggal_lahir AS birth_date
      FROM hewan h
      JOIN jenis_hewan j ON h.id_jenis = j.id
      WHERE h.no_identitas_klien = $1
    `;

    const petsResult = await pool.query(petsQuery, [id]);

    const fullName = [client.nama_depan, client.nama_tengah, client.nama_belakang]
      .filter(Boolean)
      .join(' ')
      .trim();

    return NextResponse.json({
      id: client.id,
      email: client.email,
      address: client.address,
      phone: client.phone,
      registrationDate: client.registration_date,
      name: client.type === 'Individu' ? fullName : client.nama_perusahaan,
      companyName: client.nama_perusahaan,
      type: client.type,
      pets: petsResult.rows.map(p => ({
        name: p.name,
        type: p.type,
        birthDate: p.birth_date,
      })),
    });
  } catch (error) {
    console.error('❌ Error fetching client detail:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
