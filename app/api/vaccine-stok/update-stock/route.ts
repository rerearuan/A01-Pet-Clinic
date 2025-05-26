// app/api/vaccine-stok/update-stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest) {
  const { kode, stok } = await req.json();

  if (!kode || stok < 0) {
    return NextResponse.json({ error: 'Stok tidak valid' }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE VAKSIN SET stok = $1 WHERE kode = $2`,
      [stok, kode]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update stok' }, { status: 500 });
  }
}
