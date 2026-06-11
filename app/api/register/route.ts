import { NextResponse } from 'next/server';
import { getPlayerByEmail, generateNextPlayerId, upsertPlayer, Player } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, proficiency, duration, shoes, heardFrom } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if player already exists
    let player = await getPlayerByEmail(email);
    const now = new Date().toISOString();

    if (player) {
      // If player exists, we just update their latest answers but don't reset their stats
      // Wait, if they re-register, maybe we just return their existing QR code.
      // We will just generate a new QR_ID for this specific registration/event or use their permanent one.
      // Let's use a permanent QR ID for simplicity.
      player = {
        ...player,
        name,
        phone,
        proficiency,
        duration,
        shoes,
        heardFrom,
        checkInStatus: 'Pending', // Reset to pending for the new event
      };
    } else {
      // New player
      const id = await generateNextPlayerId();
      
      // We use base64 encoding to make a URL-safe QR string
      const rawString = `${id}-${email}`;
      const qrId = Buffer.from(rawString).toString('base64').replace(/=/g, '');

      player = {
        id,
        qrId,
        name,
        email,
        phone,
        proficiency,
        duration,
        shoes,
        heardFrom,
        firstSeen: now,
        lastActive: now,
        eventsAttended: 0,
        checkInStatus: 'Pending',
        timeWhenCheckedIn: null,
      };
    }

    await upsertPlayer(player);

    // Send email with QR code if credentials exist
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(player.qrId)}`;
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px;">
          <h1 style="color: #10b981; text-align: center;">The Weekend Baddie</h1>
          <h2 style="text-align: center;">Trial Membership Confirmed!</h2>
          <p>Hi ${player.name},</p>
          <p>Welcome to The Weekend Baddie community! Your registration was successful.</p>
          <p>Below is your custom QR Code ticket. Please present this code to the event organizers upon arrival to check in.</p>
          <div style="text-align: center; margin: 30px 0; background-color: white; padding: 20px; border-radius: 10px; display: inline-block;">
            <img src="${qrCodeUrl}" alt="Your QR Code" width="300" height="300" />
          </div>
          <p><strong>Your Ticket ID:</strong> ${player.id}</p>
          <p>See you on the court!</p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"The Weekend Baddie" <${process.env.EMAIL_USER}>`,
          to: player.email,
          subject: 'Your Weekend Baddie Ticket 🎟️',
          html: htmlBody,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // We still return success because registration succeeded, even if email failed
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      qrId: player.qrId,
      name: player.name
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
