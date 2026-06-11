import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/db';

export async function GET() {
  try {
    const players = await getPlayers();
    
    const roster = players.map(player => {
      return {
        name: player.name,
        email: player.email,
        phone: player.phone,
        proficiency: player.proficiency,
        duration: player.duration,
        shoes: player.shoes,
        checkInTime: player.timeWhenCheckedIn,
        status: player.checkInStatus
      };
    });
    
    // Sort so checked-in players appear first or sort by time
    roster.sort((a, b) => {
      if (a.status === 'Checked In' && b.status === 'Pending') return -1;
      if (a.status === 'Pending' && b.status === 'Checked In') return 1;
      return 0;
    });

    return NextResponse.json(roster);

  } catch (error: any) {
    console.error('Roster fetch error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
