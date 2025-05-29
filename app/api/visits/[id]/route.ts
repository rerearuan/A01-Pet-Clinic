import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

    try {
        const params = await context.params;
        const { id } = params;
        const {
            nama_hewan,
            no_identitas_klien,
            no_front_desk,
            no_perawat_hewan,
            no_dokter_hewan
          } = await req.json();
          

      if (!nama_hewan || !no_identitas_klien) {
        return NextResponse.json(
          { success: false, message: 'Nama hewan dan identitas klien wajib diisi' },
          { status: 400 }
        );
      }

      const query = `
        SELECT 
          k.catatan, 
          k.suhu AS "bodyTemperature", 
          k.berat_badan AS "bodyWeight"
        FROM KUNJUNGAN k
        WHERE k.id_kunjungan = $1
          AND k.nama_hewan = $2
          AND k.no_identitas_klien = $3
          AND k.no_front_desk = $4
          AND k.no_perawat_hewan = $5
          AND k.no_dokter_hewan = $6
      `;

      const result = await pool.query(query, [
        id,
        nama_hewan,
        no_identitas_klien,
        no_front_desk,
        no_perawat_hewan,
        no_dokter_hewan
      ]);

      if (result.rowCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Data rekam medis tidak ditemukan' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          bodyTemperature: parseInt(result.rows[0].bodyTemperature),
          bodyWeight: parseFloat(result.rows[0].bodyWeight),
          catatan: result.rows[0].catatan
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { success: false, message: 'Terjadi kesalahan server' },
        { status: 500 }
      );
    }
}