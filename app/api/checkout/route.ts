import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Use test keys if env vars are missing
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_YourMockKeyId';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'YourMockKeySecret';

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: 150 * 100, // ₹150 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture
      notes: {
        name,
        email,
        phone,
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: key_id
    });
  } catch (err: any) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
