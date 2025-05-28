import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import pool from './db';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required');
        }
        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // 1. Fetch user from USER table
        const res = await pool.query(
          `SELECT password, email FROM "USER" WHERE LOWER(email) = $1`,
          [email]
        );
        if (res.rowCount === 0) {
          throw new Error('No user found with this email');
        }
        const userRow = res.rows[0];

        // 2. Verify password
        // 2. Verify password
        if (password !== userRow.password) {
          throw new Error('Invalid password');
        }


        // 3. Determine role
        let role: 'front-desk' | 'dokter-hewan' | 'perawat-hewan' | 'individu' | 'perusahaan' | null = null;

        // Check PEGAWAI
        const peg = await pool.query(
          `SELECT no_pegawai FROM PEGAWAI WHERE email_user = $1`,
          [email]
        );
        if ((peg.rowCount ?? 0) > 0) {
          const id = peg.rows[0].no_pegawai;
          const fd = await pool.query(
            `SELECT 1 FROM FRONT_DESK WHERE no_front_desk = $1`,
            [id]
          );
          if ((fd.rowCount ?? 0) > 0) {
            role = 'front-desk';
          } else {
            const tm = await pool.query(
              `SELECT no_tenaga_medis FROM TENAGA_MEDIS WHERE no_tenaga_medis = $1`,
              [id]
            );
            if ((tm.rowCount ?? 0) > 0) {
              const tmId = tm.rows[0].no_tenaga_medis;
              const dr = await pool.query(
                `SELECT 1 FROM DOKTER_HEWAN WHERE no_dokter_hewan = $1`,
                [tmId]
              );
              const pr = await pool.query(
                `SELECT 1 FROM PERAWAT_HEWAN WHERE no_perawat_hewan = $1`,
                [tmId]
              );
              if ((dr.rowCount ?? 0) > 0) role = 'dokter-hewan';
              else if ((pr.rowCount ?? 0) > 0) role = 'perawat-hewan';
            }
          }
        }

        // Check KLIEN
        if (!role) {
          const kli = await pool.query(
            `SELECT no_identitas FROM KLIEN WHERE email = $1`,
            [email]
          );
          if ((kli.rowCount ?? 0) > 0) {
            const cId = kli.rows[0].no_identitas;
            const ind = await pool.query(
              `SELECT 1 FROM INDIVIDU WHERE no_identitas_klien = $1`,
              [cId]
            );
            const per = await pool.query(
              `SELECT 1 FROM PERUSAHAAN WHERE no_identitas_klien = $1`,
              [cId]
            );
            if ((ind.rowCount ?? 0) > 0) role = 'individu';
            else if ((per.rowCount ?? 0) > 0) role = 'perusahaan';
          }
        }

        if (!role) {
          throw new Error('User role not found');
        }

        // Return user object without password
        return {
          id: userRow.email,
          name: userRow.email,
          email: userRow.email,
          role,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/dashboard-user';
    },
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  debug: process.env.NODE_ENV === 'development',
};
