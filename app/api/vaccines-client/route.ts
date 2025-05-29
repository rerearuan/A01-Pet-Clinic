// app/api/vaccines-client/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json([], { status: 200 });

  const { searchParams } = new URL(req.url);
  const pet = searchParams.get('pet');
  const vaccine = searchParams.get('vaccine');

  const query = `
    SELECT h.nama AS pet_name, v.nama AS vaccine_name, v.kode AS vaccine_code, v.harga, k.timestamp_awal
    FROM KUNJUNGAN k
    JOIN HEWAN h ON k.nama_hewan = h.nama AND k.no_identitas_klien = h.no_identitas_klien
    JOIN KLIEN kl ON h.no_identitas_klien = kl.no_identitas
    JOIN "USER" u ON kl.email = u.email
    JOIN VAKSIN v ON k.kode_vaksin = v.kode
    WHERE u.email = $1
    ${pet ? `AND h.nama = $2` : ''}
    ${vaccine ? (pet ? `AND v.nama = $3` : `AND v.nama = $2`) : ''}
    ORDER BY k.timestamp_awal DESC
  `;

  const values = [email];
  if (pet) values.push(pet);
  if (vaccine) values.push(vaccine);

  try {
    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
