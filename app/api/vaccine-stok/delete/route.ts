// app/api/vaccine-stok/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest) {
  const { kode } = await req.json();

  try {
    const check = await pool.query(
      `SELECT 1 FROM KUNJUNGAN WHERE kode_vaksin = $1 LIMIT 1`,
      [kode]
    );

    if (check.rows.length > 0) {
      return NextResponse.json({ error: 'Vaksin sudah digunakan dan tidak bisa dihapus' }, { status: 400 });
    }

    await pool.query(`DELETE FROM VAKSIN WHERE kode = $1`, [kode]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus vaksin' }, { status: 500 });
  }
}
