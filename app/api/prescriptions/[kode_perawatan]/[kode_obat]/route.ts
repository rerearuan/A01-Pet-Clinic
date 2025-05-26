import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Define the expected params structure
type RouteParams = { params: { kode_perawatan: string; kode_obat: string } };

// PUT - Update prescription
export async function PUT(req: NextRequest, context: unknown) {
  try {
    // Assert the context as RouteParams
    const { params } = context as RouteParams;
    const { kode_perawatan, kode_obat } = params;
    const { kuantitas_obat } = await req.json();

    // Validasi input dasar
    if (!kuantitas_obat || kuantitas_obat <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Kuantitas obat harus lebih dari 0' 
        },
        { status: 400 }
      );
    }

    // Update prescription (database triggers handle validations)
    const result = await pool.query(
      'UPDATE PERAWATAN_OBAT SET kuantitas_obat = $1 WHERE kode_perawatan = $2 AND kode_obat = $3 RETURNING *',
      [kuantitas_obat, kode_perawatan, kode_obat]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Prescription tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Ambil data prescription yang sudah diupdate
    const updatedPrescription = await pool.query(`
      SELECT 
        po.kode_perawatan,
        po.kode_obat,
        po.kuantitas_obat,
        p.nama_perawatan,
        o.nama as nama_obat,
        o.harga as harga_obat,
        (po.kuantitas_obat * o.harga) as total_harga
      FROM PERAWATAN_OBAT po
      JOIN PERAWATAN p ON po.kode_perawatan = p.kode_perawatan
      JOIN OBAT o ON po.kode_obat = o.kode
      WHERE po.kode_perawatan = $1 AND po.kode_obat = $2
    `, [kode_perawatan, kode_obat]);

    return NextResponse.json({
      success: true,
      message: 'Prescription berhasil diupdate',
      data: updatedPrescription.rows[0]
    });
  } catch (error: any) {
    console.error('Error updating prescription:', error);

    // Handle database trigger errors
    if (error.message.includes('Total harga obat melebihi total harga perawatan')) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      );
    }

    if (error.message.includes('Stok obat') && error.message.includes('tidak mencukupi')) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      );
    }

    if (error.message.includes('Perawatan tidak ditemukan') || error.message.includes('Obat tidak ditemukan')) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update prescription',
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Hapus prescription
export async function DELETE(req: NextRequest, context: unknown) {
  try {
    // Assert the context as RouteParams
    const { params } = context as RouteParams;
    const { kode_perawatan, kode_obat } = params;

    // Hapus prescription
    const result = await pool.query(
      'DELETE FROM PERAWATAN_OBAT WHERE kode_perawatan = $1 AND kode_obat = $2 RETURNING *',
      [kode_perawatan, kode_obat]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Prescription tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Restore stock on deletion
    await pool.query(
      'UPDATE OBAT SET stok = stok + $1 WHERE kode = $2',
      [result.rows[0].kuantitas_obat, kode_obat]
    );

    return NextResponse.json({
      success: true,
      message: 'Prescription berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete prescription',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}