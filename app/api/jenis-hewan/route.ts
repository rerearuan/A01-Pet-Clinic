import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { useSession } from 'next-auth/react';

export async function GET() {
  const res = await pool.query('SELECT id, nama_jenis FROM "jenis_hewan"');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const { data: session } = useSession();
  if (!session || !session.user || (session.user.role !== 'front-desk')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { nama_jenis } = await req.json();
  await pool.query('INSERT INTO "JENIS_HEWAN"(nama_jenis) VALUES ($1)', [nama_jenis]);
  return NextResponse.json({ message: 'Success' });
}
