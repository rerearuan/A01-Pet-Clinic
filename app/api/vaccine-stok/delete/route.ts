import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest) {
  const { kode } = await req.json();

  try {
    await pool.query(`DELETE FROM VAKSIN WHERE kode = $1`, [kode]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, // <-- tampilkan langsung pesan dari trigger
      { status: 400 }
    );
  }
}
