// app/api/medicines/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Mengambil semua data obat
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    let query = 'SELECT * FROM OBAT';
    let params: any[] = [];
    
    if (search) {
      query += ' WHERE nama ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY nama ASC';
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch medicines' },
      { status: 500 }
    );
  }
}

// POST - Menambah obat baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, harga, stok, dosis } = body;
    
    // Validasi input
    if (!nama || !harga || !stok || !dosis) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (isNaN(harga) || isNaN(stok) || harga < 0 || stok < 0) {
      return NextResponse.json(
        { success: false, error: 'Price and stock must be valid numbers' },
        { status: 400 }
      );
    }
    
    // Generate kode obat baru
    const codeResult = await pool.query(
      'SELECT kode FROM OBAT ORDER BY kode DESC LIMIT 1'
    );
    
    let newCode;
    if (codeResult.rows.length === 0) {
      newCode = 'MED0000001';
    } else {
      const lastCode = codeResult.rows[0].kode;
      const lastNumber = parseInt(lastCode.substring(3));
      newCode = `MED${String(lastNumber + 1).padStart(7, '0')}`;
    }
    
    // Insert obat baru
    const result = await pool.query(
      'INSERT INTO OBAT (kode, nama, harga, stok, dosis) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newCode, nama, parseInt(harga), parseInt(stok), dosis]
    );
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Medicine created successfully'
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    
    if ((error as any).code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Medicine code already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create medicine' },
      { status: 500 }
    );
  }
}