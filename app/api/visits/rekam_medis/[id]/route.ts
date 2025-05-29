// app/api/rekam-medis/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { validate as isUUID } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    // Validate ID first
    if (!isUUID(id)) {
      return NextResponse.json(
        { success: false, message: 'ID kunjungan tidak valid (harus UUID)' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Format JSON tidak valid' },
        { status: 400 }
      );
    }

    // Destructure with validation
    const requiredFields = [
      'bodyTemperature', 'bodyWeight', 'catatan',
      'nama_hewan', 'no_identitas_klien',
      'no_front_desk', 'no_perawat_hewan', 'no_dokter_hewan'
    ];

    // Check all required fields exist
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} harus diisi` },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    const bodyTemperature = parseFloat(body.bodyTemperature);
    const bodyWeight = parseFloat(body.bodyWeight);
    
    if (isNaN(bodyTemperature) || isNaN(bodyWeight)) {
      return NextResponse.json(
        { success: false, message: 'Suhu tubuh dan berat badan harus berupa angka' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update KUNJUNGAN table with all fields including catatan
      const updateKunjungan = `
        UPDATE KUNJUNGAN
        SET suhu = $1,
            berat_badan = $2,
            catatan = $3,
            nama_hewan = $4,
            no_identitas_klien = $5,
            no_front_desk = $6,
            no_perawat_hewan = $7,
            no_dokter_hewan = $8
        WHERE id_kunjungan = $9
        RETURNING *`;

      const kunjunganResult = await client.query(updateKunjungan, [
        bodyTemperature,
        bodyWeight,
        body.catatan,
        body.nama_hewan,
        body.no_identitas_klien,
        body.no_front_desk,
        body.no_perawat_hewan,
        body.no_dokter_hewan,
        id
      ]);

      if (kunjunganResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: 'Data kunjungan tidak ditemukan' },
          { status: 404 }
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          bodyTemperature: kunjunganResult.rows[0].suhu,
          bodyWeight: kunjunganResult.rows[0].berat_badan,
          catatan: kunjunganResult.rows[0].catatan
        },
        message: 'Rekam medis berhasil diperbarui'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Terjadi kesalahan pada database' },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server tak terduga' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  let body;

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await req.json();

    // Validasi field yang diperlukan
    const requiredFields = [
      'bodyTemperature', 
      'bodyWeight', 
      'catatan'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} harus diisi` },
          { status: 400 }
        );
      }
    }

    // Validasi UUID untuk id_kunjungan
    if (!isUUID(id)) {
      return NextResponse.json(
        { success: false, message: 'ID kunjungan tidak valid (harus UUID)' },
        { status: 400 }
      );
    }

    // Validasi numeric fields
    const bodyTemperature = parseInt(body.bodyTemperature);
    const bodyWeight = parseFloat(body.bodyWeight);
    
    if (isNaN(bodyTemperature) || isNaN(bodyWeight)) {
      return NextResponse.json(
        { success: false, message: 'Suhu tubuh dan berat badan harus berupa angka' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update tabel KUNJUNGAN with all fields including catatan
      const updateKunjungan = `
        UPDATE KUNJUNGAN
        SET suhu = $1,
            berat_badan = $2,
            catatan = $3
        WHERE id_kunjungan = $4
        RETURNING *`;

      const kunjunganResult = await client.query(updateKunjungan, [
        bodyTemperature,
        bodyWeight,
        body.catatan,
        id
      ]);

      if (kunjunganResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: 'Data kunjungan tidak ditemukan' },
          { status: 404 }
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          bodyTemperature: kunjunganResult.rows[0].suhu,
          bodyWeight: kunjunganResult.rows[0].berat_badan,
          catatan: kunjunganResult.rows[0].catatan
        },
        message: 'Rekam medis berhasil diperbarui'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: 'Terjadi kesalahan pada database' },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server tak terduga' },
      { status: 500 }
    );
  }
}