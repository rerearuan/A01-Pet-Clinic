// import { NextRequest, NextResponse } from "next/server";
// import pool from '@/lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth-options';

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);

//     if (!session || !session.user.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
  
//     try {
//       const { id } = params;
//       const { nama_hewan, no_identitas_klien } = await req.json();

//       if (!nama_hewan || !no_identitas_klien) {
//         return NextResponse.json(
//           { success: false, message: 'Nama hewan dan identitas klien wajib diisi' },
//           { status: 400 }
//         );
//       }

//       const query = `
//         SELECT 
//           kp.catatan, 
//           k.body_temperature AS "bodyTemperature", 
//           k.body_weight AS "bodyWeight"
//         FROM KUNJUNGAN_KEPERAWATAN kp
//         JOIN KUNJUNGAN k ON kp.id_kunjungan = k.id_kunjungan
//         WHERE kp.id_kunjungan = $1
//           AND kp.nama_hewan = $2
//           AND kp.no_identitas_klien = $3
//           AND kp.no_front_desk = $4
//           AND kp.no_perawat_hewan = $5
//           AND kp.no_dokter_hewan = $6
//       `;

//       const result = await pool.query(query, [id, nama_hewan, no_identitas_klien]);

//       if (result.rowCount === 0) {
//         return NextResponse.json(
//           { success: false, message: 'Data rekam medis tidak ditemukan' },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         data: {
//           bodyTemperature: parseFloat(result.rows[0].bodyTemperature),
//           bodyWeight: parseFloat(result.rows[0].bodyWeight),
//           catatan: result.rows[0].catatan
//         }
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       return NextResponse.json(
//         { success: false, message: 'Terjadi kesalahan server' },
//         { status: 500 }
//       );
//     }
// }
import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await params; // Added await
    const { nama_hewan, no_identitas_klien } = await req.json();

    if (!nama_hewan || !no_identitas_klien) {
      return NextResponse.json(
        { success: false, message: 'Nama hewan dan identitas klien wajib diisi' },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        kp.catatan, 
        k.body_temperature AS "bodyTemperature", 
        k.body_weight AS "bodyWeight"
      FROM KUNJUNGAN_KEPERAWATAN kp
      JOIN KUNJUNGAN k ON kp.id_kunjungan = k.id_kunjungan
      WHERE kp.id_kunjungan = $1
        AND kp.nama_hewan = $2
        AND kp.no_identitas_klien = $3
        AND kp.no_front_desk = $4
        AND kp.no_perawat_hewan = $5
        AND kp.no_dokter_hewan = $6
    `;

    const result = await pool.query(query, [id, nama_hewan, no_identitas_klien]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Data rekam medis tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        bodyTemperature: parseFloat(result.rows[0].bodyTemperature),
        bodyWeight: parseFloat(result.rows[0].bodyWeight),
        catatan: result.rows[0].catatan
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}