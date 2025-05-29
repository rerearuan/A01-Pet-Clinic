import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params; // id ini adalah visitId (id_kunjungan)
    const body = await req.json();

    const {
      kode_perawatan_baru,
      kode_perawatan_lama // Ini adalah kode perawatan yang LAMA
    } = body;

    console.log('Backend PUT: Request received for visitId:', id);
    console.log('Backend PUT: Request body:', body);

    // Asumsi: (id_kunjungan, kode_perawatan) adalah kunci unik untuk sebuah entri perawatan.
    // Kita hanya perlu id_kunjungan dan kode_perawatan_lama untuk mengidentifikasi baris yang akan diupdate.
    const updateQuery = `
      UPDATE kunjungan_keperawatan
      SET
        kode_perawatan = $3 -- Set ke kode_perawatan_BARU
      WHERE
        id_kunjungan = $1 AND
        kode_perawatan = $2 -- Match dengan kode_perawatan_LAMA
      RETURNING
        id_kunjungan AS "visitId",
        nama_hewan AS "animalName",
        no_identitas_klien AS "clientId",
        no_front_desk AS "frontDeskId",
        no_perawat_hewan AS "nurseId",
        no_dokter_hewan AS "doctorId",
        kode_perawatan AS "treatmentCode"
    `;

    const values = [
      id,
      kode_perawatan_lama,
      kode_perawatan_baru 
    ];

    const result = await pool.query(updateQuery, values);

    console.log('Backend PUT: Update query rowCount:', result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Treatment not found or old treatment code is incorrect.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Treatment updated successfully', data: result.rows[0] }
    );
  } catch (error: any) {
    console.error('Backend PUT error:', error);

    if (error.code === '23505') {
      // Duplicate key error (jika kode_perawatan_baru sudah ada untuk kombinasi (id_kunjungan, kode_perawatan_baru))
      return NextResponse.json(
        { success: false, message: 'Duplicate treatment code for this visit. Please use a different code.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Update failed due to server error.' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // id ini adalah id_kunjungan
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT
        id_kunjungan,
        nama_hewan,
        no_identitas_klien,
        no_front_desk,
        no_perawat_hewan,
        no_dokter_hewan
      FROM kunjungan
      WHERE id_kunjungan = $1
    `, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'Treatment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('GET /api/pet_treatments error:', error);
    return NextResponse.json({ success: false, message: 'Database query error' }, { status: 500 });
  }
}