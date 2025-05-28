import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const res = await pool.query('SELECT id, nama_jenis FROM "JENIS_HEWAN"');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role !== 'front-desk') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { nama_jenis } = await req.json();
  await pool.query('INSERT INTO "JENIS_HEWAN"(nama_jenis) VALUES ($1)', [nama_jenis]);
  return NextResponse.json({ message: 'Success' });
}
