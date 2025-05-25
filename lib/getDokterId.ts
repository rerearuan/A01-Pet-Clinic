import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import pool from './db';

export async function getDokterId(): Promise<string | null> {
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
