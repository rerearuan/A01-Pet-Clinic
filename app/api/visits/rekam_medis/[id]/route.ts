// // app/api/rekam-medis/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import pool from '@/lib/db';
// import { validate as isUUID } from 'uuid';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-options';

// export async function PUT(req: NextRequest, context: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);

//     if (!session || !session.user.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//   const { id } = context.params;

//   try {
//     // Validate ID first
//     if (!isUUID(id)) {
//       return NextResponse.json(
//         { success: false, message: 'ID kunjungan tidak valid (harus UUID)' },
//         { status: 400 }
//       );
//     }

//     // Parse request body
//     let body;
//     try {
//       body = await req.json();
//     } catch (error) {
//       return NextResponse.json(
//         { success: false, message: 'Format JSON tidak valid' },
//         { status: 400 }
//       );
//     }

//     // Destructure with validation
//     const requiredFields = [
//       'bodyTemperature', 'bodyWeight', 'catatan',
//       'nama_hewan', 'no_identitas_klien',
//       'no_front_desk', 'no_perawat_hewan', 'no_dokter_hewan'
//     ];

//     // Check all required fields exist
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, message: `Field ${field} harus diisi` },
//           { status: 400 }
//         );
//       }
//     }

//     // Validate numeric fields
//     const bodyTemperature = parseFloat(body.bodyTemperature);
//     const bodyWeight = parseFloat(body.bodyWeight);
    
//     if (isNaN(bodyTemperature) || isNaN(bodyWeight)) {
//       return NextResponse.json(
//         { success: false, message: 'Suhu tubuh dan berat badan harus berupa angka' },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');

//       // Update KUNJUNGAN table
//       const updateKunjungan = `
//         UPDATE KUNJUNGAN
//         SET suhu = $1,
//             berat_badan = $2
//         WHERE id_kunjungan = $3
//         RETURNING *`;

//       const kunjunganResult = await client.query(updateKunjungan, [
//         bodyTemperature,
//         bodyWeight,
//         id
//       ]);

//       if (kunjunganResult.rowCount === 0) {
//         await client.query('ROLLBACK');
//         return NextResponse.json(
//           { success: false, message: 'Data kunjungan tidak ditemukan' },
//           { status: 404 }
//         );
//       }

//       // Update KUNJUNGAN_KEPERAWATAN table
//       const updateKeperawatan = `
//         UPDATE KUNJUNGAN_KEPERAWATAN
//         SET catatan = $1
//         WHERE id_kunjungan = $2
//           AND no_identitas_klien = $3
//           AND no_front_desk = $4
//           AND no_perawat_hewan = $5
//           AND no_dokter_hewan = $6
//           AND nama_hewan = $7
//         RETURNING *`;

//       const keperawatanResult = await client.query(updateKeperawatan, [
//         body.catatan,
//         id,
//         body.no_identitas_klien,
//         body.no_front_desk,
//         body.no_perawat_hewan,
//         body.no_dokter_hewan,
//         body.nama_hewan
//       ]);

//       if (keperawatanResult.rowCount === 0) {
//         await client.query('ROLLBACK');
//         return NextResponse.json(
//           { success: false, message: 'Data kunjungan keperawatan tidak ditemukan' },
//           { status: 404 }
//         );
//       }

//       await client.query('COMMIT');

//       return NextResponse.json({
//         success: true,
//         data: {
//           bodyTemperature: kunjunganResult.rows[0].body_temperature,
//           bodyWeight: kunjunganResult.rows[0].body_weight,
//           catatan: keperawatanResult.rows[0].catatan
//         },
//         message: 'Rekam medis berhasil diperbarui'
//       });

//     } catch (error) {
//       await client.query('ROLLBACK');
//       console.error('Database error:', error);
//       return NextResponse.json(
//         { success: false, message: 'Terjadi kesalahan pada database' },
//         { status: 500 }
//       );
//     } finally {
//       client.release();
//     }

//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Terjadi kesalahan server tak terduga' },
//       { status: 500 }
//     );
//   }
// }


// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions);

//     if (!session || !session.user.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//   try {
//     // Parse request body
//     const body = await request.json();

//     // Validasi field yang diperlukan
//     const requiredFields = [
//       'bodyTemperature', 
//       'bodyWeight', 
//       'catatan',
//       'kunjungan'  // Data kunjungan lengkap
//     ];

//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, message: `Field ${field} harus diisi` },
//           { status: 400 }
//         );
//       }
//     }

//     // Validasi UUID untuk id_kunjungan
//     if (!isUUID(body.kunjungan.id)) {
//       return NextResponse.json(
//         { success: false, message: 'ID kunjungan tidak valid (harus UUID)' },
//         { status: 400 }
//       );
//     }

//     // Validasi numeric fields
//     const bodyTemperature = parseFloat(body.bodyTemperature);
//     const bodyWeight = parseFloat(body.bodyWeight);
    
//     if (isNaN(bodyTemperature) || isNaN(bodyWeight)) {
//       return NextResponse.json(
//         { success: false, message: 'Suhu tubuh dan berat badan harus berupa angka' },
//         { status: 400 }
//       );
//     }

//     const client = await pool.connect();
//     try {
//       await client.query('BEGIN');

//       // 1. Update tabel KUNJUNGAN (suhu dan berat badan)
//       const updateKunjungan = `
//         UPDATE KUNJUNGAN
//         SET suhu = $1,
//             berat_badan = $2
//         WHERE id_kunjungan = $3
//         RETURNING *`;

//       const kunjunganResult = await client.query(updateKunjungan, [
//         bodyTemperature,
//         bodyWeight,
//         body.kunjungan.id
//       ]);

//       if (kunjunganResult.rowCount === 0) {
//         await client.query('ROLLBACK');
//         return NextResponse.json(
//           { success: false, message: 'Data kunjungan tidak ditemukan' },
//           { status: 404 }
//         );
//       }

//       // 2. Insert catatan keperawatan (tanpa UUID baru)
//       const insertKeperawatan = `
//         INSERT INTO KUNJUNGAN_KEPERAWATAN (
//           id_kunjungan,
//           no_identitas_klien,
//           no_front_desk,
//           no_perawat_hewan,
//           no_dokter_hewan,
//           nama_hewan,
//           catatan,
//           created_at
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
//         RETURNING *`;

//       const keperawatanResult = await client.query(insertKeperawatan, [
//         body.kunjungan.id,
//         body.kunjungan.clientId,
//         body.kunjungan.frontDeskId,
//         body.kunjungan.nurseId,
//         body.kunjungan.doctorId,
//         body.kunjungan.petName,
//         body.catatan
//       ]);

//       await client.query('COMMIT');

//       return NextResponse.json({
//         success: true,
//         data: {
//           bodyTemperature,
//           bodyWeight,
//           catatan: body.catatan,
//           kunjungan: kunjunganResult.rows[0],
//           keperawatan: keperawatanResult.rows[0]
//         },
//         message: 'Rekam medis berhasil dibuat'
//       });

//     } catch (error) {
//       await client.query('ROLLBACK');
//       console.error('Database error:', error);
//       return NextResponse.json(
//         { success: false, message: 'Terjadi kesalahan pada database' },
//         { status: 500 }
//       );
//     } finally {
//       client.release();
//     }

//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Terjadi kesalahan server tak terduga' },
//       { status: 500 }
//     );
//   }
// }
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
  
  const { id } = await context.params; // Added await

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

      // Update KUNJUNGAN table
      const updateKunjungan = `
        UPDATE KUNJUNGAN
        SET suhu = $1,
            berat_badan = $2
        WHERE id_kunjungan = $3
        RETURNING *`;

      const kunjunganResult = await client.query(updateKunjungan, [
        bodyTemperature,
        bodyWeight,
        id
      ]);

      if (kunjunganResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: 'Data kunjungan tidak ditemukan' },
          { status: 404 }
        );
      }

      // Update KUNJUNGAN_KEPERAWATAN table
      const updateKeperawatan = `
        UPDATE KUNJUNGAN_KEPERAWATAN
        SET catatan = $1
        WHERE id_kunjungan = $2
          AND no_identitas_klien = $3
          AND no_front_desk = $4
          AND no_perawat_hewan = $5
          AND no_dokter_hewan = $6
          AND nama_hewan = $7
        RETURNING *`;

      const keperawatanResult = await client.query(updateKeperawatan, [
        body.catatan,
        id,
        body.no_identitas_klien,
        body.no_front_desk,
        body.no_perawat_hewan,
        body.no_dokter_hewan,
        body.nama_hewan
      ]);

      if (keperawatanResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: 'Data kunjungan keperawatan tidak ditemukan' },
          { status: 404 }
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          bodyTemperature: kunjunganResult.rows[0].body_temperature,
          bodyWeight: kunjunganResult.rows[0].body_weight,
          catatan: keperawatanResult.rows[0].catatan
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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Parse request body
    const body = await request.json();

    // Validasi field yang diperlukan
    const requiredFields = [
      'bodyTemperature', 
      'bodyWeight', 
      'catatan',
      'kunjungan'  // Data kunjungan lengkap
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
    if (!isUUID(body.kunjungan.id)) {
      return NextResponse.json(
        { success: false, message: 'ID kunjungan tidak valid (harus UUID)' },
        { status: 400 }
      );
    }

    // Validasi numeric fields
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

      // 1. Update tabel KUNJUNGAN (suhu dan berat badan)
      const updateKunjungan = `
        UPDATE KUNJUNGAN
        SET suhu = $1,
            berat_badan = $2
        WHERE id_kunjungan = $3
        RETURNING *`;

      const kunjunganResult = await client.query(updateKunjungan, [
        bodyTemperature,
        bodyWeight,
        body.kunjungan.id
      ]);

      if (kunjunganResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: 'Data kunjungan tidak ditemukan' },
          { status: 404 }
        );
      }

      // 2. Insert catatan keperawatan (tanpa UUID baru)
      const insertKeperawatan = `
        INSERT INTO KUNJUNGAN_KEPERAWATAN (
          id_kunjungan,
          no_identitas_klien,
          no_front_desk,
          no_perawat_hewan,
          no_dokter_hewan,
          nama_hewan,
          catatan,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`;

      const keperawatanResult = await client.query(insertKeperawatan, [
        body.kunjungan.id,
        body.kunjungan.clientId,
        body.kunjungan.frontDeskId,
        body.kunjungan.nurseId,
        body.kunjungan.doctorId,
        body.kunjungan.petName,
        body.catatan
      ]);

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          bodyTemperature,
          bodyWeight,
          catatan: body.catatan,
          kunjungan: kunjunganResult.rows[0],
          keperawatan: keperawatanResult.rows[0]
        },
        message: 'Rekam medis berhasil dibuat'
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