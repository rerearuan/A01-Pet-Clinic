import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'; 

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_: NextRequest, context: any) {
  // Explicitly destructure params from context
  const { params } = context as RouteParams;
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !['front-desk', 'dokter-hewan'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const res = await pool.query('SELECT * FROM jenis_hewan WHERE id = $1', [params.id]);
    if (res.rowCount === 0) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  // Explicitly destructure params from context
  const { params } = context as RouteParams;
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'front-desk') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { nama } = await req.json();
    if (!nama) {
      return NextResponse.json({ error: 'Missing nama field' }, { status: 400 });
    }
    await pool.query('UPDATE jenis_hewan SET nama_jenis = $1 WHERE id = $2', [nama, params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: any) {
  // Explicitly destructure params from context
  const { params } = context as RouteParams;
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'front-desk') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await pool.query('DELETE FROM jenis_hewan WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}