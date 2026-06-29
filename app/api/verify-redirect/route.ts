import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { 
  upsertPlayer, 
  generateNextPlayerId, 
  getPlayerByEmail 
} from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { paymentId, draft } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'No payment ID provided' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ success: false, error: 'Razorpay keys not configured' }, { status: 500 });
    }

    // 1. Verify payment status directly with Razorpay
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    const paymentData = await rzpRes.json();

    if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
      return NextResponse.json({ success: false, error: 'Payment not successful yet' }, { status: 400 });
    }

    // Payment is successful! Use the provided draft data to register them.
    if (!draft || !draft.email) {
      // If we don't have draft, maybe we can use the email from Razorpay
      return NextResponse.json({ success: false, error: 'Registration data missing. Please contact support.' }, { status: 400 });
    }

    const { name, email, phone, proficiency, duration, shoes, heardFrom } = draft;

    // 2. See if the player already exists in the main DB
    let player = await getPlayerByEmail(email);
    const now = new Date().toISOString();

    if (player) {
      // If they already exist, just update them and mark them as Paid for this session
      // But check if they are ALREADY paid to prevent sending duplicate emails on refresh
      if (player.razorpay_payment_id === paymentId && player.payment_status === 'Paid') {
        // They already completed this exact payment! Just return their QR code.
        return NextResponse.json({ success: true, qrId: player.qrId, name: player.name });
      }

      player = {
        ...player,
        name,
        phone,
        proficiency,
        duration,
        shoes,
        heardFrom,
        checkInStatus: 'Pending',
        razorpay_payment_id: paymentId,
        payment_status: 'Paid',
      };
    } else {
      // Create new player
      const id = await generateNextPlayerId();
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
        razorpay_payment_id: paymentId,
        payment_status: 'Paid',
      };
    }

    // 3. Save to main database
    await upsertPlayer(player);

    // 4. Send email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_PORT === '465' ? true : false,
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
        console.error('Failed to send email in verify-redirect:', emailError);
      }
    }

    return NextResponse.json({ success: true, qrId: player.qrId, name: player.name });
  } catch (err: any) {
    console.error('Verify Redirect Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
