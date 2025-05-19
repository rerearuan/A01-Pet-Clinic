import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: NextRequest) {
  try {
    // Mendapatkan session user yang sedang login
    const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      alamat,
      nomor_telepon,
      namaDepan,
      namaTengah,
      namaBelakang,
      namaPerusahaan,
      tanggalAkhirKerja,
      sertifikat,
      jadwalPraktik,
      userRole,
    } = await req.json();

    const email = session.user.email;

    // Update data user dasar
    await pool.query('BEGIN');

    await pool.query('UPDATE "USER" SET alamat = $1, nomor_telepon = $2 WHERE email = $3', [
      alamat,
      nomor_telepon, 
      email,
    ]);

    if (userRole === 'individu' || userRole === 'perusahaan') {
      // Mendapatkan no_identitas klien
      const klienQuery = await pool.query('SELECT no_identitas FROM KLIEN WHERE email = $1', [email]);

      if (klienQuery.rows.length > 0) {
        const noIdentitas = klienQuery.rows[0].no_identitas;

        if (userRole === 'individu') {
          // Update data individu
          await pool.query(
            'UPDATE INDIVIDU SET nama_depan = $1, nama_tengah = $2, nama_belakang = $3 WHERE no_identitas_klien = $4',
            [namaDepan, namaTengah || null, namaBelakang, noIdentitas]
          );
        } else if (userRole === 'perusahaan') {
          // Update data perusahaan
          await pool.query('UPDATE PERUSAHAAN SET nama_perusahaan = $1 WHERE no_identitas_klien = $2', [
            namaPerusahaan,
            noIdentitas,
          ]);
        }
      }
    } else if (userRole === 'front-desk' || userRole === 'dokter-hewan' || userRole === 'perawat-hewan') {
      // Mendapatkan no_pegawai
      const pegawaiQuery = await pool.query('SELECT no_pegawai FROM PEGAWAI WHERE email_user = $1', [
        email,
      ]);

      if (pegawaiQuery.rows.length > 0) {
        const noPegawai = pegawaiQuery.rows[0].no_pegawai;

        // Update tanggal akhir kerja
        if (tanggalAkhirKerja) {
          await pool.query('UPDATE PEGAWAI SET tanggal_akhir_kerja = $1 WHERE no_pegawai = $2', [
            tanggalAkhirKerja,
            noPegawai,
          ]);
        }

        if (userRole === 'dokter-hewan') {
          // Update jadwal praktik dokter hewan
          if (jadwalPraktik && jadwalPraktik.length > 0) {
            // Hapus jadwal lama
            await pool.query('DELETE FROM JADWAL_PRAKTIK WHERE no_dokter_hewan = $1', [noPegawai]);

            // Tambahkan jadwal baru
            for (const jadwal of jadwalPraktik) {
              await pool.query(
                'INSERT INTO JADWAL_PRAKTIK (no_dokter_hewan, hari, jam) VALUES ($1, $2, $3)',
                [noPegawai, jadwal.hari, jadwal.jam]
              );
            }
          }
        }

        if (userRole === 'dokter-hewan' || userRole === 'perawat-hewan') {
          // Update data sertifikat kompetensi
          if (sertifikat && sertifikat.length > 0) {
            // Hapus sertifikat lama
            await pool.query('DELETE FROM SERTIFIKAT_KOMPETENSI WHERE no_tenaga_medis = $1', [noPegawai]);

            // Tambahkan sertifikat baru
            for (const cert of sertifikat) {
              await pool.query(
                'INSERT INTO SERTIFIKAT_KOMPETENSI (no_sertifikat_kompetensi, no_tenaga_medis, nama_sertifikat) VALUES ($1, $2, $3)',
                [cert.nomorSertifikat, noPegawai, cert.namaSertifikat]
              );
            }
          }
        }
      }
    }

    await pool.query('COMMIT');
    return NextResponse.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}