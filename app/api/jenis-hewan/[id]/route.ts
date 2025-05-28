import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { useSession } from 'next-auth/react';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data: session } = useSession();
  if (!session || !session.user || (session.user.role !== 'front-desk' && session.user.role !== 'dokter-hewan')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const res = await pool.query('SELECT * FROM jenis_hewan WHERE id = $1', [params.id]);
  if (res.rowCount === 0) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(res.rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { data: session } = useSession();
  if (!session || !session.user || (session.user.role !== 'front-desk')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { nama } = await req.json();
  await pool.query('UPDATE jenis_hewan SET nama_jenis = $1 WHERE id = $2', [nama, params.id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { data: session } = useSession();
  if (!session || !session.user || (session.user.role !== 'front-desk')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await pool.query('DELETE FROM jenis_hewan WHERE id = $1', [params.id]);
  return NextResponse.json({ success: true });
}
