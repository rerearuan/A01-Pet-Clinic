// app/api/auth/change-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db/';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: Request) {
  try {
    // Get the session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Old and new passwords are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    // Fetch the user from the database
    const { rows } = await pool.query('SELECT password FROM "USER" WHERE email = $1', [session.user.email]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Old password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await pool.query('UPDATE "USER" SET password = $1 WHERE email = $2', [hashedNewPassword, session.user.email]);

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}