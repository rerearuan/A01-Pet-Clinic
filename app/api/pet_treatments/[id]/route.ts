// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-options';
  
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

//   const session = await getServerSession(authOptions);

//     if (!session || !session.user.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//   try {
//     const id = params.id;
//     const body = await req.json();

//     const {
//       nama_hewan,
//       no_identitas_klien,
//       no_front_desk,
//       no_perawat_hewan,
//       no_dokter_hewan,
//       kode_perawatan_baru,
//       kode_perawatan_lama,
//       catatan,
//     } = body;

//     const updateQuery = `
//       UPDATE kunjungan_keperawatan
//       SET 
//         kode_perawatan = $6,
//         catatan = $8
//       WHERE id_kunjungan = $9 AND nama_hewan = $1 AND no_identitas_klien = $2 AND no_front_desk = $3 AND no_perawat_hewan = $4 AND
//         no_dokter_hewan = $5 AND kode_perawatan = $7
//       RETURNING 
//         id_kunjungan AS "visitId",
//         nama_hewan AS "animalName",
//         no_identitas_klien AS "clientId",
//         no_front_desk AS "frontDeskId",
//         no_perawat_hewan AS "nurseId",
//         no_dokter_hewan AS "doctorId",
//         kode_perawatan AS "treatmentCode",
//         catatan AS "treatmentNotes"
//     `;

//     const values = [
//       nama_hewan,
//       no_identitas_klien,
//       no_front_desk,
//       no_perawat_hewan,
//       no_dokter_hewan,
//       kode_perawatan_baru,
//       kode_perawatan_lama,
//       catatan,
//       id,
//     ];

//     const result = await pool.query(updateQuery, values);

//     if (result.rowCount === 0) {
//       return NextResponse.json(
//         { success: false, message: 'Treatment not found or no changes made' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: 'Treatment updated successfully', data: result.rows[0] }
//     );
//   } catch (error: any) {
//     console.error('PUT error:', error);

//     if (error.code === '23505') {
//       // Duplicate key error
//       return NextResponse.json(
//         { success: false, message: 'Duplicate treatment code. Please use a different code.' },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: 'Update failed due to server error.' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);

//     if (!session || !session.user.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//   const id = params.id;

//   try {
//     const result = await pool.query(`
//       SELECT 
//         id_kunjungan,
//         nama_hewan,
//         no_identitas_klien,
//         no_front_desk,
//         no_perawat_hewan,
//         no_dokter_hewan
//       FROM kunjungan
//       WHERE id_kunjungan = $1
//     `, [id]);

//     if (result.rowCount === 0) {
//       return NextResponse.json({ success: false, message: 'Treatment not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: result.rows[0] });
//   } catch (error) {
//     console.error('GET /api/pet_treatments error:', error);
//     return NextResponse.json({ success: false, message: 'Database query error' }, { status: 500 });
//   }
// }


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
    const { id } = await params; // Await the params Promise
    const body = await req.json();

    const {
      nama_hewan,
      no_identitas_klien,
      no_front_desk,
      no_perawat_hewan,
      no_dokter_hewan,
      kode_perawatan_baru,
      kode_perawatan_lama,
      catatan,
    } = body;

    const updateQuery = `
      UPDATE kunjungan_keperawatan
      SET 
        kode_perawatan = $6,
        catatan = $8
      WHERE id_kunjungan = $9 AND nama_hewan = $1 AND no_identitas_klien = $2 AND no_front_desk = $3 AND no_perawat_hewan = $4 AND
        no_dokter_hewan = $5 AND kode_perawatan = $7
      RETURNING 
        id_kunjungan AS "visitId",
        nama_hewan AS "animalName",
        no_identitas_klien AS "clientId",
        no_front_desk AS "frontDeskId",
        no_perawat_hewan AS "nurseId",
        no_dokter_hewan AS "doctorId",
        kode_perawatan AS "treatmentCode",
        catatan AS "treatmentNotes"
    `;

    const values = [
      nama_hewan,
      no_identitas_klien,
      no_front_desk,
      no_perawat_hewan,
      no_dokter_hewan,
      kode_perawatan_baru,
      kode_perawatan_lama,
      catatan,
      id,
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Treatment not found or no changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Treatment updated successfully', data: result.rows[0] }
    );
  } catch (error: any) {
    console.error('PUT error:', error);

    if (error.code === '23505') {
      // Duplicate key error
      return NextResponse.json(
        { success: false, message: 'Duplicate treatment code. Please use a different code.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Update failed due to server error.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params; // Await the params Promise

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