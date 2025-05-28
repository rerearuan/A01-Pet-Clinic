import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { randomUUID } from 'crypto';

export async function GET() {
  const res = await pool.query('SELECT * FROM jenis_hewan ORDER BY nama_jenis');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { nama } = await req.json();
  const id = randomUUID();
  await pool.query('INSERT INTO jenis_hewan (id, nama_jenis) VALUES ($1, $2)', [id, nama]);
  return NextResponse.json({ success: true, id });
}
