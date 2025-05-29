import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id_kunjungan, kode_vaksin } = await req.json();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const dokter = await client.query(`
      SELECT d.no_dokter_hewan AS id
      FROM "USER" u
      JOIN PEGAWAI p ON u.email = p.email_user
      JOIN TENAGA_MEDIS tm ON p.no_pegawai = tm.no_tenaga_medis
      JOIN DOKTER_HEWAN d ON tm.no_tenaga_medis = d.no_dokter_hewan
      WHERE u.email = $1
    `, [email]);

    const dokterId = dokter.rows[0]?.id;
    if (!dokterId) throw new Error('Dokter tidak ditemukan');

    const kunjungan = await client.query(`
      SELECT kode_vaksin FROM KUNJUNGAN
      WHERE id_kunjungan = $1 AND no_dokter_hewan = $2 AND timestamp_akhir IS NULL
      FOR UPDATE
    `, [id_kunjungan, dokterId]);

    if (kunjungan.rowCount === 0) {
      throw new Error('Kunjungan tidak ditemukan atau sudah ditutup');
    }

    const kodeLama = kunjungan.rows[0].kode_vaksin;
    if (kodeLama) {
      await client.query(`UPDATE VAKSIN SET stok = stok + 1 WHERE kode = $1`, [kodeLama]);
    }

    const vaksin = await client.query(`
      SELECT stok FROM VAKSIN WHERE kode = $1 FOR UPDATE
    `, [kode_vaksin]);

    if (!vaksin.rows[0] || vaksin.rows[0].stok <= 0) {
      throw new Error('Stok Vaksin yang dipilih sudah habis');
    }

    await client.query(`UPDATE VAKSIN SET stok = stok - 1 WHERE kode = $1`, [kode_vaksin]);
    await client.query(`UPDATE KUNJUNGAN SET kode_vaksin = $1 WHERE id_kunjungan = $2`, [kode_vaksin, id_kunjungan]);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Vaksinasi berhasil diperbarui' });

  } catch (err: any) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: err.message }, { status: 400 });
  } finally {
    client.release();
  }
}
