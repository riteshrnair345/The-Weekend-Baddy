'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [ticketData, setTicketData] = useState<{ qrId: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get email from local storage
    const draftStr = localStorage.getItem('twb_register_draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.email) {
          setEmail(draft.email);
        } else {
          setError("We couldn't find your email to verify the payment. Please check your inbox for the confirmation!");
        }
      } catch (err) {
        setError("Error reading local data. Please check your email for the ticket.");
      }
    } else {
      setError("No registration data found. If you paid, please check your email for the ticket!");
    }
  }, []);

  useEffect(() => {
    if (!email || isPaid || error) return;

    // 2. Poll the server every 2.5 seconds to see if Webhook marked them as Paid
    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/player/status?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        
        if (data.success && data.status === 'Paid') {
          setIsPaid(true);
          setTicketData({ qrId: data.qrId, name: data.name });
          // Clear draft now that they are paid
          localStorage.removeItem('twb_register_draft');
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    };

    // Check immediately
    checkPaymentStatus();

    // Then start polling
    const interval = setInterval(checkPaymentStatus, 2500);
    return () => clearInterval(interval);
  }, [email, isPaid, error]);

  return (
    <div className="min-h-screen bg-brand-yellow-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-brand-purple/10 text-center relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10">
          {error ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-brand-purple">Payment Received?</h1>
              <p className="text-brand-purple/70">{error}</p>
              <Link href="/">
                <button className="w-full bg-brand-purple text-brand-yellow-light font-bold py-3 rounded-xl hover:bg-[#3a1a5d] transition-colors">
                  Return Home
                </button>
              </Link>
            </div>
          ) : !isPaid ? (
            <div className="space-y-6 flex flex-col items-center py-8">
              <Loader2 className="w-16 h-16 text-brand-purple animate-spin" />
              <div>
                <h1 className="text-2xl font-black text-brand-purple mb-2">Verifying Payment...</h1>
                <p className="text-brand-purple/70 text-sm">
                  Please don't close this page. We are waiting for Razorpay to confirm your payment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-black text-brand-purple mb-1">You're In!</h1>
              <p className="text-brand-purple/70 text-sm mb-6">
                A confirmation copy has been sent to your email.
              </p>

              {ticketData && (
                <div className="bg-brand-yellow-light p-4 rounded-2xl w-full border border-brand-purple/10 shadow-sm">
                  <p className="text-brand-purple font-bold mb-4">{ticketData.name}'s Entry Pass</p>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketData.qrId)}`}
                    alt="Entry QR Code"
                    className="w-48 h-48 mx-auto rounded-lg shadow-sm"
                  />
                  <p className="text-xs text-brand-purple/50 mt-4">
                    Show this QR code at the venue.
                  </p>
                </div>
              )}

              <Link href="/" className="block w-full mt-6">
                <button className="w-full bg-brand-pink text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-brand-pink/20">
                  Return Home
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
