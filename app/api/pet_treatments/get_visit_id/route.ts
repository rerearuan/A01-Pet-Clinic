import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT id_kunjungan AS "visitId", no_identitas_klien AS clientId, no_front_desk AS frontDeskId, no_dokter_hewan AS doctorId, no_perawat_hewan AS nurseID
      FROM kunjungan
    `);

    return NextResponse.json({
      success: true,
      message: 'Visit IDs retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    console.error('GET /api/pet_treatments/get_visit_id error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database query error',
    }, { status: 500 });
  }
}
