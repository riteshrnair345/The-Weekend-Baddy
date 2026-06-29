import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');

  const adminPin = process.env.NEXT_PUBLIC_ADMIN_PIN;

  if (!adminPin || pin !== adminPin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const players = await getPlayers();
    
    // Define the CSV header
    const headers = ['Name', 'Phone Number', 'Age', 'Proficiency', 'Duration', 'Heard From', 'Registration Date'];
    
    // Map players to CSV rows
    const rows = players.map(player => {
      return [
        `"${player.name.replace(/"/g, '""')}"`,
        `"${player.phone.replace(/"/g, '""')}"`,
        `"${player.age || ''}"`,
        `"${player.proficiency}"`,
        `"${player.duration}"`,
        `"${player.heardFrom}"`,
        `"${new Date(player.firstSeen).toLocaleString()}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="racketheads_players.csv"'
      }
    });

  } catch (error) {
    console.error('Failed to generate CSV:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
