import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { 
  getPendingRegistration, 
  deletePendingRegistration, 
  upsertPlayer, 
  generateNextPlayerId, 
  getPlayerByEmail 
} from '@/lib/db';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json({ success: false, error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // We only care about successful payments
    if (event.event === 'payment.captured' || event.event === 'payment_link.paid') {
      const paymentEntity = event.payload.payment.entity;
      const email = paymentEntity.email;
      const phone = paymentEntity.contact;
      const paymentId = paymentEntity.id;

      if (!email) {
        console.error("No email found in webhook payload");
        return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });
      }

      // 1. Look up the pending registration
      const pendingReg = await getPendingRegistration(email);

      if (!pendingReg) {
        console.error(`No pending registration found for ${email}`);
        return NextResponse.json({ success: true, message: 'No pending reg found, ignoring' });
      }

      // 2. See if the player already exists in the main DB
      let player = await getPlayerByEmail(email);
      const now = new Date().toISOString();

      if (player) {
        // Update existing player
        player = {
          ...player,
          ...pendingReg, // overwrite with latest form data
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
          ...pendingReg,
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
          console.error('Failed to send email in webhook:', emailError);
        }
      }

      // 5. Delete pending registration to clean up
      await deletePendingRegistration(email);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
