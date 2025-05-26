// app/api/vaccine-stok/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, harga, stok } = body;

  if (!nama || harga < 0 || stok < 0) {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
  }

  const kode = 'VAC' + Math.floor(100 + Math.random() * 900); // e.g. VAC123

  try {
    await pool.query(
      `INSERT INTO VAKSIN (kode, nama, harga, stok) VALUES ($1, $2, $3, $4)`,
      [kode, nama, harga, stok]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal tambah vaksin' }, { status: 500 });
  }
}
