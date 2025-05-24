// app/api/hewan/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  const session = await getServerSession(authOptions);

    if (!session || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  try {
    const queryText = 'SELECT * FROM HEWAN';
    const { rows } = await pool.query(queryText);
    
    return NextResponse.json({ 
      success: true, 
      data: rows 
    });
  } catch (error) {
    console.error('Error fetching hewan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hewan data' },
      { status: 500 }
    );
  }
}