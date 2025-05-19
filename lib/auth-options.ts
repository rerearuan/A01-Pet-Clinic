import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import pool from './db';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { email, password } = credentials;

        // Fetch user
        const { rows } = await pool.query('SELECT * FROM "USER" WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Determine role
        let role = null;
        const { rows: pegawai } = await pool.query('SELECT no_pegawai FROM PEGAWAI WHERE email_user = $1', [email]);
        if (pegawai.length > 0) {
          const no_pegawai = pegawai[0].no_pegawai;
          const { rows: frontDesk } = await pool.query('SELECT no_front_desk FROM FRONT_DESK WHERE no_front_desk = $1', [no_pegawai]);
          if (frontDesk.length > 0) {
            role = 'front-desk';
          } else {
            const { rows: tenagaMedis } = await pool.query('SELECT no_tenaga_medis FROM TENAGA_MEDIS WHERE no_tenaga_medis = $1', [no_pegawai]);
            if (tenagaMedis.length > 0) {
              const no_tenaga_medis = tenagaMedis[0].no_tenaga_medis;
              const { rows: dokter } = await pool.query('SELECT no_dokter_hewan FROM DOKTER_HEWAN WHERE no_dokter_hewan = $1', [no_tenaga_medis]);
              const { rows: perawat } = await pool.query('SELECT no_perawat_hewan FROM PERAWAT_HEWAN WHERE no_perawat_hewan = $1', [no_tenaga_medis]);
              if (dokter.length > 0) {
                role = 'dokter-hewan';
              } else if (perawat.length > 0) {
                role = 'perawat-hewan';
              }
            }
          }
        } else {
          const { rows: klien } = await pool.query('SELECT no_identitas FROM KLIEN WHERE email = $1', [email]);
          if (klien.length > 0) {
            const no_identitas = klien[0].no_identitas;
            const { rows: individu } = await pool.query('SELECT no_identitas_klien FROM INDIVIDU WHERE no_identitas_klien = $1', [no_identitas]);
            const { rows: perusahaan } = await pool.query('SELECT no_identitas_klien FROM PERUSAHAAN WHERE no_identitas_klien = $1', [no_identitas]);
            if (individu.length > 0) {
              role = 'individu';
            } else if (perusahaan.length > 0) {
              role = 'perusahaan';
            }
          }
        }

        if (!role) {
          throw new Error('User role not found');
        }

        return {
          id: user.email,
          email: user.email,
          name: user.email, // Replace with actual name if available in USER table
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user }) {
      return !!user;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs
};