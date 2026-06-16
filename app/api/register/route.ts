import { NextResponse } from 'next/server';
import { getPlayerByEmail, generateNextPlayerId, upsertPlayer, Player } from '@/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, proficiency, duration, shoes, heardFrom, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Payment details missing' }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'YourMockKeySecret';
    const bodyToSign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(bodyToSign.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
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
        razorpay_payment_id,
        payment_status: 'Paid',
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
        razorpay_payment_id,
        payment_status: 'Paid',
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
        <div style="font-family: Arial, sans-serif; color: #000; font-size: 14px; line-height: 1.6;">
          <p>Hi ${player.name},</p>
          <p>You're officially signed up for RacketHeads Kochi! Here are your details:</p>
          <p style="margin-left: 20px;">
            Player ID &nbsp;: ${player.id}<br/>
            Proficiency : ${player.duration}
          </p>
          <p>Your entry pass (QR code) is attached to this email. Please show it when you arrive at the venue — we'll scan it to check you in.</p>
          <p>Save this email — your Player ID stays the same for all future sessions.</p>
          <p>See you on the court! 🏸🏸🏸🏸🏸<br/>
          RacketHeads Kochi Team</p>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"RacketHeads Kochi" <${process.env.EMAIL_USER}>`,
          to: player.email,
          subject: 'Your RacketHeads Kochi Ticket 🎟️',
          html: htmlBody,
          attachments: [
            {
              filename: 'qr-code.png',
              path: qrCodeUrl,
            }
          ]
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
