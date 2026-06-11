import { NextResponse } from 'next/server';
import { savePlayers } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Check for authorization header to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PIN || "0000"}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Overwrite the database with an empty array
    await savePlayers([]);

    return NextResponse.json({ success: true, message: 'Database reset successfully' });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
