import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions); // req dan res tidak dibutuhkan di App Router

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT 
        id_kunjungan AS "id",
        nama_hewan AS "petName",
        no_identitas_klien AS "clientId",
        no_front_desk AS "frontDeskId",
        no_perawat_hewan AS "nurseId",
        no_dokter_hewan AS "doctorId",
        tipe_kunjungan AS "visitType",
        timestamp_awal AS "startTime",
        timestamp_akhir AS "endTime"
      FROM KUNJUNGAN
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET /api/pet_treatments error:', error);
    return NextResponse.json({ success: false, message: 'Database query error' }, { status: 500 });
  }
}

// app/api/visits/route.ts
export async function PUT(request: Request) {
  try {
    const {
      id,
      clientId,
      petName,
      visitType,
      startTime,
      endTime,
      frontDeskId,
      nurseId,
      doctorId
    } = await request.json();

    // Validasi input
    if (!id || !startTime) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Pastikan format DateTime
    const startDate = new Date(startTime);

    const endDate = endTime ? new Date(endTime) : null;
    
    if (isNaN(startDate.getTime()) ||   (endDate !== null && isNaN(endDate.getTime()))){
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE KUNJUNGAN SET
        nama_hewan = $1,
        no_identitas_klien = $2,
        no_front_desk = $3,
        no_perawat_hewan = $4,
        no_dokter_hewan = $5,
        tipe_kunjungan = $6,
        timestamp_awal = $7,
        timestamp_akhir = $8
      WHERE id_kunjungan = $9
      RETURNING *`,
      [
        petName,
        clientId,
        frontDeskId,
        nurseId,
        doctorId,
        visitType,
        startDate,
        endDate,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        startTime: result.rows[0].timestamp_awal,
        endTime: result.rows[0].timestamp_akhir
      }
    });
  } catch (error: any ) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('PUT /api/visits error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage,
      },
      { status: 400}
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  try {
    const {
      clientId,
      petName,
      visitType,
      startTime,
      endTime,
      frontDeskId,
      nurseId,
      doctorId
    } = await request.json();

    

    // Validasi input
    if (!clientId || !petName || !startTime) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Validasi format tanggal
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : null;
    
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid start time format' },
        { status: 400 }
      );
    }

    if (endDate !== null && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid end time format' },
        { status: 400 }
      );
    }

    // Generate UUID
    const visitId = uuidv4();

    // Insert ke database
    const result = await pool.query(
      `INSERT INTO KUNJUNGAN (
        id_kunjungan,
        nama_hewan,
        no_identitas_klien,
        no_front_desk,
        no_perawat_hewan,
        no_dokter_hewan,
        tipe_kunjungan,
        timestamp_awal,
        timestamp_akhir
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        visitId,
        petName,
        clientId,
        frontDeskId,
        nurseId,
        doctorId,
        visitType,
        startDate,
        endDate
      ]
    );

    console.log('Input values:', {
      visitId,
      petName,
      clientId,
      frontDeskId,  // Likely the problematic one
      nurseId,
      doctorId,
      visitType,
      startTime,
      endTime
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id_kunjungan,
        petName: result.rows[0].nama_hewan,
        clientId: result.rows[0].no_identitas_klien,
        frontDeskId: result.rows[0].no_front_desk,
        nurseId: result.rows[0].no_perawat_hewan,
        doctorId: result.rows[0].no_dokter_hewan,
        visitType: result.rows[0].tipe_kunjungan,
        startTime: result.rows[0].timestamp_awal,
        endTime: result.rows[0].timestamp_akhir
      }
    });

  } catch (error: any ) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('POST /api/visits error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: errorMessage,
      },
      { status: 400}
    );
  }
}
