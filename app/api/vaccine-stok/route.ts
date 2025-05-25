// app/api/vaccine-stok/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT v.*,
        EXISTS (
          SELECT 1 FROM KUNJUNGAN k WHERE k.kode_vaksin = v.kode
        ) AS used
      FROM VAKSIN v
      ORDER BY kode DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data vaksin' }, { status: 500 });
  }
}
