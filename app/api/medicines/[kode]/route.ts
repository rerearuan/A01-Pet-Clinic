import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Define the type for the route context
interface RouteContext {
  params: Promise<{ kode: string }>;
}

// GET - Mengambil obat berdasarkan kode
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { kode } = await context.params; // Resolve the Promise

    const result = await pool.query('SELECT * FROM OBAT WHERE kode = $1', [kode]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch medicine' }, { status: 500 });
  }
}

// PUT - Update obat
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { kode } = await context.params; // Resolve the Promise
    const body = await request.json();
    const { nama, harga, stok, dosis } = body;

    // Validasi input
    if (!nama || !harga || !stok || !dosis) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (isNaN(harga) || isNaN(stok) || harga < 0 || stok < 0) {
      return NextResponse.json(
        { success: false, error: 'Price and stock must be valid numbers' },
        { status: 400 }
      );
    }

    // Check if medicine exists
    const checkResult = await pool.query('SELECT kode FROM OBAT WHERE kode = $1', [kode]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    // Update medicine
    const result = await pool.query(
      'UPDATE OBAT SET nama = $1, harga = $2, stok = $3, dosis = $4 WHERE kode = $5 RETURNING *',
      [nama, parseInt(harga), parseInt(stok), dosis, kode]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Medicine updated successfully',
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    return NextResponse.json({ success: false, error: 'Failed to update medicine' }, { status: 500 });
  }
}

// DELETE - Hapus obat
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { kode } = await context.params; // Resolve the Promise

    // Check if medicine exists
    const checkResult = await pool.query('SELECT kode FROM OBAT WHERE kode = $1', [kode]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Medicine not found' }, { status: 404 });
    }

    // Check if medicine is used in any treatment
    const usageCheck = await pool.query('SELECT COUNT(*) as count FROM PERAWATAN_OBAT WHERE kode_obat = $1', [kode]);

    if (parseInt(usageCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete medicine that is used in treatments' },
        { status: 409 }
      );
    }

    // Delete medicine
    await pool.query('DELETE FROM OBAT WHERE kode = $1', [kode]);

    return NextResponse.json({
      success: true,
      message: 'Medicine deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete medicine' }, { status: 500 });
  }
}