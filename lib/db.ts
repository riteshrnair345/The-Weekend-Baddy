import { kv } from '@vercel/kv';

// Define the player interface
export interface Player {
  id: string; // TWB-001
  qrId: string; // The unique ID for the QR code
  name: string;
  email: string;
  age: number;
  proficiency: string;
  duration: string;
  gear: string;
  heardFrom: string;
  firstSeen: string; // ISO timestamp
  lastActive: string; // ISO timestamp
  eventsAttended: number;
  checkInStatus: 'Pending' | 'Checked In';
  timeWhenCheckedIn: string | null;
}

const ROSTER_KEY = 'twb_roster';

// Read all players
export async function getPlayers(): Promise<Player[]> {
  try {
    const data = await kv.get<Player[]>(ROSTER_KEY);
    return data || [];
  } catch (error) {
    console.error('Failed to get players from KV:', error);
    return [];
  }
}

// Write all players
export async function savePlayers(players: Player[]): Promise<void> {
  try {
    await kv.set(ROSTER_KEY, players);
  } catch (error) {
    console.error('Failed to save players to KV:', error);
  }
}

// Find a player by QR ID
export async function getPlayerByQrId(qrId: string): Promise<Player | undefined> {
  const players = await getPlayers();
  return players.find((p) => p.qrId === qrId);
}

// Find a player by Email
export async function getPlayerByEmail(email: string): Promise<Player | undefined> {
  const players = await getPlayers();
  return players.find((p) => p.email.toLowerCase() === email.toLowerCase());
}

// Add or update a player
export async function upsertPlayer(player: Player): Promise<void> {
  const players = await getPlayers();
  const index = players.findIndex((p) => p.id === player.id);

  if (index !== -1) {
    players[index] = player;
  } else {
    players.push(player);
  }

  await savePlayers(players);
}

// Generate the next Player ID (e.g., TWB-001)
export async function generateNextPlayerId(): Promise<string> {
  const players = await getPlayers();
  let maxId = 0;

  for (const player of players) {
    if (player.id.startsWith('TWB-')) {
      const num = parseInt(player.id.replace('TWB-', ''), 10);
      if (!isNaN(num) && num > maxId) {
        maxId = num;
      }
    }
  }

  return `TWB-${(maxId + 1).toString().padStart(3, '0')}`;
}
