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
    const result = await pool.query(`
      SELECT kode_perawatan, nama_perawatan
      FROM PERAWATAN
    `);

    return NextResponse.json({
      success: true,
      message: 'treatment codes retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    console.error('GET /api/pet_treatments/get_treatment_code error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database query error',
    }, { status: 500 });
  }
}
