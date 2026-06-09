import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/db';

export async function GET() {
  try {
    const players = await getPlayers();
    
    // We only want to return basic info for the dashboard
    // and we evaluate check-in status (e.g. if checked in within the last 16 hours)
    const now = new Date().getTime();
    
    const roster = players.map(player => {
      let status = 'Pending';
      let checkInTime = null;
      
      if (player.timeWhenCheckedIn) {
        const lastCheckIn = new Date(player.timeWhenCheckedIn).getTime();
        // Checked in within the last 16 hours counts for the current event
        if (now - lastCheckIn < 16 * 60 * 60 * 1000) {
          status = 'Checked In';
          checkInTime = player.timeWhenCheckedIn;
        }
      }
      
      return {
        name: player.name,
        email: player.email,
        checkInTime: checkInTime,
        status: status
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
