// /app/api/kunjungan/open/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT id_kunjungan
      FROM KUNJUNGAN
      WHERE kode_vaksin IS NULL
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('[OPEN_KUNJUNGAN_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch open kunjungan' }, { status: 500 });
  }
}
