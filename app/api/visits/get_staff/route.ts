import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  try {
    const query = `
        SELECT p.no_pegawai as id, p.email_user, 'front_desk' AS role
        FROM PEGAWAI p
        JOIN FRONT_DESK f ON p.no_pegawai = f.no_front_desk
        UNION ALL
        SELECT p.no_pegawai as id, p.email_user, 'dokter_hewan' AS role
        FROM PEGAWAI p
        JOIN TENAGA_MEDIS t ON p.no_pegawai = t.no_tenaga_medis
        JOIN DOKTER_HEWAN d ON t.no_tenaga_medis = d.no_dokter_hewan
        UNION ALL
        SELECT p.no_pegawai as id, p.email_user, 'perawat_hewan' AS role
        FROM PEGAWAI p
        JOIN TENAGA_MEDIS t ON p.no_pegawai = t.no_tenaga_medis
        JOIN PERAWAT_HEWAN pr ON t.no_tenaga_medis = pr.no_perawat_hewan
        `;
    const { rows } = await pool.query(query);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data email.' }, { status: 500 });
  }
}
