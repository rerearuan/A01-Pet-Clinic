import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Ambil ID dokter berdasarkan user yang login
    const { rows: dokterRows } = await pool.query(
      `SELECT d.no_dokter_hewan AS id
       FROM "USER" u
       JOIN PEGAWAI p ON u.email = p.email_user
       JOIN TENAGA_MEDIS tm ON p.no_pegawai = tm.no_tenaga_medis
       JOIN DOKTER_HEWAN d ON tm.no_tenaga_medis = d.no_dokter_hewan
       WHERE u.email = $1`,
      [email]
    );

    const dokterId = dokterRows[0]?.id;
    if (!dokterId) return NextResponse.json([], { status: 200 });

    // Ambil semua vaksin yang memiliki stok >= 0
    const { rows } = await pool.query(
      `SELECT kode, nama, stok FROM VAKSIN WHERE stok >= 0 ORDER BY kode ASC`
    );

    return NextResponse.json(
      rows.map((v: any) => ({
        kode: v.kode ?? '',
        nama: v.nama ?? '',
        stok: v.stok ?? 0,
      }))
    );
  } catch (err) {
    console.error('Failed to fetch vaksin stok:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
