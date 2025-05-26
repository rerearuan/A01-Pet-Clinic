// app/api/treatments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT kode_perawatan, nama_perawatan, biaya_perawatan FROM PERAWATAN ORDER BY kode_perawatan'
    );
    
    return NextResponse.json({
      success: true,
      data: result.rows.map(row => ({
        kode_perawatan: row.kode_perawatan,
        nama_perawatan: row.nama_perawatan,
        biaya_perawatan: row.biaya_perawatan
      }))
    });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch treatments' },
      { status: 500 }
    );
  }
}


// POST - Create new treatment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, cost } = body;

    if (!name || !cost || isNaN(Number(cost))) {
      return NextResponse.json(
        { success: false, error: 'Invalid treatment name or cost' },
        { status: 400 }
      );
    }

    // Generate new treatment code
    const countResult = await pool.query('SELECT COUNT(*) FROM PERAWATAN');
    const count = parseInt(countResult.rows[0].count);
    const newCode = `TRM${String(count + 1).padStart(3, '0')}`;

    // Insert new treatment
    await pool.query(
      'INSERT INTO PERAWATAN (kode_perawatan, nama_perawatan, biaya_perawatan) VALUES ($1, $2, $3)',
      [newCode, name, Number(cost)]
    );

    return NextResponse.json({
      success: true,
      data: {
        code: newCode,
        name,
        cost: Number(cost)
      }
    });
  } catch (error) {
    console.error('Error creating treatment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create treatment' },
      { status: 500 }
    );
  }
}