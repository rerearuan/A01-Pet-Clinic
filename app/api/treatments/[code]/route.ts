import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Define the expected params structure
type RouteParams = { params: { code: string } };

// PUT - Update treatment
export async function PUT(req: NextRequest, context: unknown) {
  try {
    // Assert the context as RouteParams
    const { params } = context as RouteParams;
    const { code } = params;
    const body = await req.json();
    const { name, cost } = body;

    if (!name || !cost || isNaN(Number(cost))) {
      return NextResponse.json(
        { success: false, error: 'Invalid treatment name or cost' },
        { status: 400 }
      );
    }

    // Check if treatment exists
    const existingResult = await pool.query(
      'SELECT kode_perawatan FROM PERAWATAN WHERE kode_perawatan = $1',
      [code]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Treatment not found' },
        { status: 404 }
      );
    }

    // Update treatment
    await pool.query(
      'UPDATE PERAWATAN SET nama_perawatan = $1, biaya_perawatan = $2 WHERE kode_perawatan = $3',
      [name, Number(cost), code]
    );

    return NextResponse.json({
      success: true,
      data: {
        code,
        name,
        cost: Number(cost)
      }
    });
  } catch (error) {
    console.error('Error updating treatment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update treatment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete treatment
export async function DELETE(req: NextRequest, context: unknown) {
  try {
    // Assert the context as RouteParams
    const { params } = context as RouteParams;
    const { code } = params;

    // Check if treatment exists
    const existingResult = await pool.query(
      'SELECT kode_perawatan FROM PERAWATAN WHERE kode_perawatan = $1',
      [code]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Treatment not found' },
        { status: 404 }
      );
    }

    // Check if treatment is being used in any visits
    const usageResult = await pool.query(
      'SELECT id_kunjungan FROM KUNJUNGAN_KEPERAWATAN WHERE kode_perawatan = $1 LIMIT 1',
      [code]
    );

    if (usageResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete treatment that is being used in visits' },
        { status: 400 }
      );
    }

    // Delete treatment
    await pool.query(
      'DELETE FROM PERAWATAN WHERE kode_perawatan = $1',
      [code]
    );

    return NextResponse.json({
      success: true,
      message: 'Treatment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete treatment' },
      { status: 500 }
    );
  }
}