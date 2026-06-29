import Redis from 'ioredis';

const redisUrl = process.env.KV_REDIS_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL || '';

if (!redisUrl) {
  throw new Error("Redis URL is missing! Database is not connected properly in Vercel Environment Variables.");
}

export const kv = new Redis(redisUrl);

// Define the player interface
export interface Player {
  id: string; // TWB-001
  qrId: string; // The unique ID for the QR code
  name: string;
  email: string;
  phone: string;
  age?: string;
  proficiency: string;
  duration: string;
  shoes: string;
  heardFrom: string;
  firstSeen: string; // ISO timestamp
  lastActive: string; // ISO timestamp
  eventsAttended: number;
  checkInStatus: 'Pending' | 'Checked In';
  timeWhenCheckedIn: string | null;
  razorpay_payment_id?: string;
  payment_status?: 'Paid' | 'Pending' | 'Free';
}

const ROSTER_KEY = 'twb_roster';

// Read all players
export async function getPlayers(): Promise<Player[]> {
  const data = await kv.get(ROSTER_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Player[];
  } catch (e) {
    console.error("Failed to parse JSON from Redis", e);
    return [];
  }
}

// Write all players
export async function savePlayers(players: Player[]): Promise<void> {
  await kv.set(ROSTER_KEY, JSON.stringify(players));
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

export interface PendingRegistration {
  name: string;
  email: string;
  phone: string;
  age?: string;
  proficiency: string;
  duration: string;
  shoes: string;
  heardFrom: string;
}

export async function savePendingRegistration(email: string, data: PendingRegistration): Promise<void> {
  const key = `pending_reg:${email.toLowerCase()}`;
  // Set with an expiration of 2 hours
  await kv.set(key, JSON.stringify(data), 'EX', 7200);
}

export async function getPendingRegistration(email: string): Promise<PendingRegistration | null> {
  const key = `pending_reg:${email.toLowerCase()}`;
  const data = await kv.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as PendingRegistration;
  } catch (e) {
    console.error("Failed to parse pending reg from Redis", e);
    return null;
  }
}

export async function deletePendingRegistration(email: string): Promise<void> {
  const key = `pending_reg:${email.toLowerCase()}`;
  await kv.del(key);
}
