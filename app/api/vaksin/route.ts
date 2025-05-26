// app/api/vaksin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

async function getDokterId() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  const { rows } = await pool.query(`
    SELECT d.no_dokter_hewan AS id
    FROM "USER" u
    JOIN PEGAWAI p ON u.email = p.email_user
    JOIN TENAGA_MEDIS tm ON p.no_pegawai = tm.no_tenaga_medis
    JOIN DOKTER_HEWAN d ON tm.no_tenaga_medis = d.no_dokter_hewan
    WHERE u.email = $1
  `, [email]);

  return rows[0]?.id ?? null;
}

export async function GET(req: NextRequest) {
  const dokterId = await getDokterId();
  if (!dokterId) return NextResponse.json([], { status: 200 });

  const { rows } = await pool.query(`
    SELECT 
      k.id_kunjungan, 
      TO_CHAR(k.timestamp_awal, 'FMDay, DD Month YYYY') AS tanggal_kunjungan,
      v.nama AS nama_vaksin
    FROM KUNJUNGAN k
    JOIN VAKSIN v ON k.kode_vaksin = v.kode
    WHERE k.kode_vaksin IS NOT NULL AND k.no_dokter_hewan = $1
    ORDER BY k.timestamp_awal DESC
  `, [dokterId]);

  const data = rows.map((r: any) => ({
    id_kunjungan: r.id_kunjungan,
    tanggal_kunjungan: r.tanggal_kunjungan,
    vaksin: r.nama_vaksin,
  }));

  return NextResponse.json(data);
}
