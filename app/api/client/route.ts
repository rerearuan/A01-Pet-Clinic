import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const res = await pool.query(`
    SELECT k.no_identitas,
           COALESCE(i.nama_depan || ' ' || i.nama_belakang, p.nama_perusahaan, 'Tanpa Nama') AS nama
    FROM KLIEN k
    LEFT JOIN INDIVIDU i ON k.no_identitas = i.no_identitas_klien
    LEFT JOIN PERUSAHAAN p ON k.no_identitas = p.no_identitas_klien
  `);

  return NextResponse.json(res.rows);
}

