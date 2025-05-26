import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions); // req dan res tidak dibutuhkan di App Router

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT 
        id_kunjungan AS "visitId",
        nama_hewan AS "animalName",
        no_identitas_klien AS "clientId",
        no_front_desk AS "frontDeskId",
        no_perawat_hewan AS "nurseId",
        no_dokter_hewan AS "doctorId",
        kode_perawatan AS "treatmentCode"
      FROM kunjungan_keperawatan
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET /api/pet_treatments error:', error);
    return NextResponse.json({ success: false, message: 'Database query error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await req.json();
    const {
      id_kunjungan,
      nama_hewan,
      no_identitas_klien,
      no_front_desk,
      no_perawat_hewan,
      no_dokter_hewan,
      kode_perawatan
    } = body;
    console.log('Request body:', body);
    
    if (!id_kunjungan || !nama_hewan || !no_identitas_klien || !kode_perawatan) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    const insertQuery = `
      INSERT INTO kunjungan_keperawatan 
      (id_kunjungan, nama_hewan, no_identitas_klien, no_front_desk, no_perawat_hewan, no_dokter_hewan, kode_perawatan)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_kunjungan AS "visitId"
    `;
    
    const insertValues = [
      id_kunjungan,
      nama_hewan,
      no_identitas_klien,
      no_front_desk || null,
      no_perawat_hewan || null,
      no_dokter_hewan || null,
      kode_perawatan
    ];
    
    const insertResult = await pool.query(insertQuery, insertValues);
    

    return NextResponse.json({ success: true, data: insertResult.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/pet_treatments error:', error);
    return NextResponse.json({ success: false, message: 'Database insert error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body = await req.json();

    const {
      visitId,
      animalName,
      clientId,
      frontDeskId,
      nurseId,
      doctorId,
      treatmentCode,
    } = body;

    const deleteQuery = `
      DELETE FROM kunjungan_keperawatan
      WHERE 
        id_kunjungan = $1 AND 
        nama_hewan = $2 AND 
        no_identitas_klien = $3 AND 
        no_front_desk = $4 AND 
        no_perawat_hewan = $5 AND 
        no_dokter_hewan = $6 AND
        kode_perawatan = $7
    `;

    const values = [
      visitId,
      animalName,
      clientId,
      frontDeskId,
      nurseId,
      doctorId,
      treatmentCode
    ];

    const result = await pool.query(deleteQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Treatment not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Treatment deleted successfully' });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Deletion failed due to server error' },
      { status: 500 }
    );
  }
}
