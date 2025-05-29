import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { randomUUID } from 'crypto';

export async function GET() {
  const res = await pool.query('SELECT id, nama_jenis FROM jenis_hewan');
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'front-desk') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { nama_jenis } = await req.json();

    if (!nama_jenis) {
      return NextResponse.json(
        { error: 'Missing nama_jenis field' },
        { status: 400 }
      );
    }

    const id = randomUUID();
    await pool.query(
      'INSERT INTO jenis_hewan (id, nama_jenis) VALUES ($1, $2)',
      [id, nama_jenis]
    );

    return NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error: any) {
    console.error('Database error:', error);

    if (error.code === '23502' && error.column === 'nama_jenis') {
      return NextResponse.json(
        { error: 'Missing nama_jenis field' },
        { status: 400 }
      );
    }

    if (error.code === 'P0001') {
      const msg = error.message.replace(/^ERROR:\s*/, '');
      return NextResponse.json(
        { error: msg },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
