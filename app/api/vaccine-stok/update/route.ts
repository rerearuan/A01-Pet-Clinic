// app/api/vaccine-stok/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest) {
  const { kode, nama, harga } = await req.json();

  if (!kode || !nama || harga < 0) {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  }

  try {
    await pool.query(
      `UPDATE VAKSIN SET nama = $1, harga = $2 WHERE kode = $3`,
      [nama, harga, kode]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update vaksin' }, { status: 500 });
  }
}
