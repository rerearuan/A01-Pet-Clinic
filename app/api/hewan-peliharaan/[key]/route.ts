import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'; 

interface RouteParams {
  params: {
    key: string;
  };
}

function parseKey(key: string) {
  const [nama, no_identitas_klien] = key.split('_');
  if (!nama || !no_identitas_klien) {
    throw new Error('Invalid key format');
  }
  return { nama, no_identitas_klien };
}

export async function GET(_: NextRequest, context: any) {
  const { params }: { params: { key: string } } = context;
  try {
    const { nama, no_identitas_klien } = parseKey(params.key);
    const res = await pool.query(
      'SELECT * FROM hewan WHERE nama = $1 AND no_identitas_klien = $2',
      [nama, no_identitas_klien]
    );
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
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !['front-desk', 'individu', 'perusahaan'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { params }: { params: { key: string } } = context;
  try {
    const { nama, no_identitas_klien } = parseKey(params.key);
    const { id_jenis, tanggal_lahir, url_foto } = await req.json();
    await pool.query(
      'UPDATE hewan SET id_jenis = $1, tanggal_lahir = $2, url_foto = $3 WHERE nama = $4 AND no_identitas_klien = $5',
      [id_jenis, tanggal_lahir, url_foto, nama, no_identitas_klien]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'front-desk') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { params }: { params: { key: string } } = context;
  try {
    const { nama, no_identitas_klien } = parseKey(params.key);
    await pool.query(
      'DELETE FROM hewan WHERE nama = $1 AND no_identitas_klien = $2',
      [nama, no_identitas_klien]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}