'use client';

import { useState, useEffect, Suspense } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('razorpay_payment_id');
  
  const [isPaid, setIsPaid] = useState(false);
  const [ticketData, setTicketData] = useState<{ qrId: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get draft from local storage
    const draftStr = localStorage.getItem('twb_register_draft');
    let draft = null;
    
    if (draftStr) {
      try {
        draft = JSON.parse(draftStr);
      } catch (err) {
        console.error("Draft error", err);
      }
    }

    if (!paymentId) {
      setError("No Payment ID found. If you just paid, please check your email for the ticket confirmation.");
      return;
    }

    // 2. Verify payment with backend
    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/verify-redirect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, draft }),
        });
        
        const data = await res.json();
        
        if (data.success) {
          setIsPaid(true);
          setTicketData({ qrId: data.qrId, name: data.name });
          localStorage.removeItem('twb_register_draft');
        } else {
          setError(data.error || "Payment verification failed. Please check your email or contact support.");
        }
      } catch (err) {
        console.error("Verification error", err);
        setError("Network error while verifying payment. Please keep this Payment ID: " + paymentId);
      }
    };

    verifyPayment();
  }, [paymentId]);

  return (
    <div className="min-h-screen bg-brand-yellow-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-brand-purple/10 text-center relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10">
          {error ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-brand-purple">Payment Status</h1>
              <p className="text-brand-purple/70 text-sm">{error}</p>
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
                  We are securely confirming your payment with Razorpay.
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-yellow-light flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-brand-purple animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
