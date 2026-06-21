import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ success: false, error: 'Razorpay keys not configured in environment variables' }, { status: 500 });
    }

    // Determine the base URL for the callback
    const host = request.headers.get('host') || 'www.racketheads.club';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const callbackUrl = `${protocol}://${host}/success`;

    // 1. Ask Razorpay to create a Payment Link
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    
    const body = {
      amount: 5000, // 50.00 INR (amount in paise)
      currency: "INR",
      accept_partial: false,
      reference_id: `twb_${Date.now()}`,
      description: "Payment for RacketHeads Kochi",
      customer: {
        name,
        email,
        contact: phone,
      },
      notify: {
        sms: false,
        email: true
      },
      reminder_enable: false,
      callback_url: callbackUrl,
      callback_method: "get"
    };

    const rzpRes = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('Razorpay Link Error:', data);
      return NextResponse.json({ success: false, error: data.error?.description || 'Failed to generate payment link' }, { status: 400 });
    }

    // Razorpay returns `short_url` which is the actual link to pay on
    return NextResponse.json({ success: true, short_url: data.short_url });
  } catch (err: any) {
    console.error('Create Payment Link Error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
