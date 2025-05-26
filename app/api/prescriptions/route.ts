import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Ambil semua prescription (unchanged)
export async function GET() {
  try {
    const query = `
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
      ORDER BY po.kode_perawatan, po.kode_obat
    `;
    
    const result = await pool.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch prescriptions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Tambah prescription baru
export async function POST(req: NextRequest) {
  try {
    const { kode_perawatan, kode_obat, kuantitas_obat } = await req.json();

    // Validasi input dasar
    if (!kode_perawatan || !kode_obat || !kuantitas_obat) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Kode perawatan, kode obat, dan kuantitas obat wajib diisi' 
        },
        { status: 400 }
      );
    }

    if (kuantitas_obat <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Kuantitas obat harus lebih dari 0' 
        },
        { status: 400 }
      );
    }

    // Insert prescription (database triggers handle validations)
    const result = await pool.query(
      'INSERT INTO PERAWATAN_OBAT (kode_perawatan, kode_obat, kuantitas_obat) VALUES ($1, $2, $3) RETURNING *',
      [kode_perawatan, kode_obat, kuantitas_obat]
    );

    // Ambil data lengkap prescription yang baru dibuat
    const newPrescription = await pool.query(`
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
      message: 'Prescription berhasil ditambahkan',
      data: newPrescription.rows[0]
    });
  } catch (error: any) {
    console.error('Error creating prescription:', error);

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

    if (error.code === '23505') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Kombinasi perawatan dan obat sudah ada' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create prescription',
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}