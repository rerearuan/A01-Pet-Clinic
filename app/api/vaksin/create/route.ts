import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id_kunjungan, kode_vaksin } = await req.json();
  if (!id_kunjungan || !kode_vaksin) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const visit = await client.query(
      `SELECT timestamp_akhir FROM KUNJUNGAN WHERE id_kunjungan = $1 AND no_dokter_hewan = (
        SELECT d.no_dokter_hewan FROM "USER" u
        JOIN PEGAWAI p ON u.email = p.email_user
        JOIN TENAGA_MEDIS tm ON p.no_pegawai = tm.no_tenaga_medis
        JOIN DOKTER_HEWAN d ON tm.no_tenaga_medis = d.no_dokter_hewan
        WHERE u.email = $2
      ) FOR UPDATE`,
      [id_kunjungan, email]
    );

    if (visit.rowCount === 0 || visit.rows[0].timestamp_akhir !== null)
      throw new Error('Kunjungan tidak valid');

    await client.query(
      `UPDATE KUNJUNGAN SET kode_vaksin = $1 WHERE id_kunjungan = $2`,
      [kode_vaksin, id_kunjungan]
    );

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Vaksinasi berhasil ditambahkan' });
  } catch (err: any) {
    await client.query('ROLLBACK');
    const msg = err.message || 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 400 });
  } finally {
    client.release();
  }
}
