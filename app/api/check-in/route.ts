import { NextResponse } from 'next/server';
import { getPlayerByQrId, upsertPlayer } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrId } = body;

    if (!qrId) {
      return NextResponse.json({ success: false, error: 'No QR ID provided' }, { status: 400 });
    }

    const player = await getPlayerByQrId(qrId);

    if (!player) {
      return NextResponse.json({ success: false, error: 'Invalid ticket' }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Check if already checked in recently (e.g., within 12 hours)
    if (player.timeWhenCheckedIn) {
      const lastCheckIn = new Date(player.timeWhenCheckedIn);
      const timeDiff = new Date().getTime() - lastCheckIn.getTime();
      
      if (timeDiff < 12 * 60 * 60 * 1000) {
        return NextResponse.json({ success: false, error: 'Already checked in', name: player.name });
      }
    }

    // Update player stats
    player.lastActive = now;
    player.eventsAttended += 1;
    player.checkInStatus = 'Checked In';
    player.timeWhenCheckedIn = now;

    await upsertPlayer(player);

    return NextResponse.json({ 
      success: true, 
      message: 'Check-in successful', 
      name: player.name,
      age: player.age,
      proficiency: player.proficiency,
      duration: player.duration,
      time: now
    });

  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
