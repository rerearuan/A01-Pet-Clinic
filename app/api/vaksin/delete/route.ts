import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getDokterId } from '@/lib/getDokterId';

export async function POST(req: NextRequest) {
  const dokterId = await getDokterId();
  if (!dokterId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id_kunjungan } = await req.json();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const vi = await client.query(`
      SELECT kode_vaksin FROM KUNJUNGAN 
      WHERE id_kunjungan = $1 AND no_dokter_hewan = $2 FOR UPDATE
    `, [id_kunjungan, dokterId]);

    if (vi.rows.length === 0 || !vi.rows[0].kode_vaksin) {
      throw new Error('Vaksinasi tidak ditemukan');
    }

    await client.query(`UPDATE VAKSIN SET stok = stok + 1 WHERE kode = $1`, [vi.rows[0].kode_vaksin]);
    await client.query(`UPDATE KUNJUNGAN SET kode_vaksin = NULL WHERE id_kunjungan = $1`, [id_kunjungan]);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Vaksinasi berhasil dihapus' });
  } catch (err: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}