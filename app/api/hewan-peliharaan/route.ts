import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { useSession } from 'next-auth/react';

export async function GET() {
  const res = await pool.query(`
    SELECT h.*, j.nama_jenis, k.email FROM hewan h
    JOIN jenis_hewan j ON h.id_jenis = j.id
    JOIN klien k ON h.no_identitas_klien = k.no_identitas
  `);
  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  const { data: session } = useSession();
  if (!session || !session.user || (session.user.role !== 'front-desk' && session.user.role !== 'individu' && session.user.role !== 'perusahaan')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { nama, no_identitas_klien, id_jenis, tanggal_lahir, url_foto } = await req.json();
  await pool.query(
    `INSERT INTO hewan (nama, no_identitas_klien, id_jenis, tanggal_lahir, url_foto)
     VALUES ($1, $2, $3, $4, $5)`,
    [nama, no_identitas_klien, id_jenis, tanggal_lahir, url_foto]
  );
  return NextResponse.json({ success: true });
}