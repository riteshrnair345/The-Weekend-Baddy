'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Sparkles, Smile, Trophy, Clock, Zap, Phone, Mail, User, Info, CreditCard, ArrowLeft } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    proficiency: '',
    duration: '',
    shoes: '',
    heardFrom: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<{ qrId: string; name: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    localStorage.setItem('twb_register_draft', JSON.stringify(newFormData));
  };

  const handleSelect = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    localStorage.setItem('twb_register_draft', JSON.stringify(newFormData));
  };

  useEffect(() => {
    const draft = localStorage.getItem('twb_register_draft');
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error('Failed to parse draft form data');
      }
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.proficiency || !formData.duration || !formData.shoes || !formData.heardFrom) {
      setError("Please fill out all fields before continuing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Save draft so the user doesn't lose their data if they come back
    localStorage.setItem('twb_register_draft', JSON.stringify(formData));

    try {
      // Create a dynamic payment link
      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }),
      });

      const data = await res.json();

      if (data.success && data.short_url) {
        // Redirect directly to the unique payment portal
        window.location.href = data.short_url;
      } else {
        setError(data.error || "Failed to create payment link. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (ticketData) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=3a1a5d&bgcolor=ffffff&data=${encodeURIComponent(ticketData.qrId)}`;
    
    return (
      <div className="min-h-screen bg-brand-yellow-light text-brand-purple flex flex-col items-center justify-center p-4 selection:bg-brand-pink/20 relative overflow-hidden">
        {/* Soft Background Image */}
        <div className="absolute inset-0 bg-[url('/badminton-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none mix-blend-multiply" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 text-center space-y-6 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative z-10">
          
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-brand-purple">
              You're In, {ticketData.name}! 🎉
            </h1>
            <p className="text-brand-purple/70 text-sm font-medium">
              We've emailed you a copy of your ticket. Get ready for an amazing session!
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl inline-block shadow-sm mx-auto border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="Your QR Code Ticket" 
              className="w-64 h-64 object-contain rounded-xl"
            />
          </div>

          <div className="bg-brand-pink/10 border border-brand-pink/20 rounded-2xl p-4 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <p className="text-brand-purple text-sm font-medium leading-relaxed">
              Take a quick screenshot of this code to show at the entrance!
            </p>
          </div>

          <button
            onClick={() => {
              setTicketData(null);
              const blankForm = { name: '', email: '', phone: '', proficiency: '', duration: '', shoes: '', heardFrom: '' };
              setFormData(blankForm);
              localStorage.removeItem('twb_register_draft');
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all shadow-sm"
          >
            Register another player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-yellow-light text-brand-purple p-4 sm:p-8 flex flex-col items-center justify-center selection:bg-brand-pink/20 relative overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      {/* Soft Background Image */}
      <div className="absolute inset-0 bg-[url('/badminton-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none mix-blend-multiply" />

      {/* Back Button */}
      <div className="absolute top-6 left-4 sm:left-8 z-20">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-brand-purple rounded-xl font-bold text-sm transition-all shadow-sm border border-brand-purple/10 backdrop-blur-sm hover:shadow-md hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Link>
      </div>

      <div className="max-w-2xl w-full relative z-10 pt-4">
        
        {/* Header */}
        <header className="mb-10 flex flex-col items-center justify-center">
          <img 
            src="/logo.jpg" 
            alt="RacketHeads Kochi Logo" 
            className="h-24 w-auto rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6 rotate-3 hover:rotate-6 transition-transform object-contain" 
          />
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-purple mb-3 text-center">
            RacketHeads Kochi
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" />
            Entry Fee: ₹150 / session
          </div>
        </header>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-brand-purple">
              <Smile className="w-6 h-6 text-brand-pink" /> Let's get to know you
            </h2>
            <p className="text-brand-purple/70 text-sm font-medium">
              We just need a few details to customize your experience.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3 shadow-sm">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              
              {/* 1. Full Name */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-pink" /> What's your full name? <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border border-brand-purple/20 rounded-2xl px-5 py-4 text-brand-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all placeholder:text-brand-purple/40 shadow-sm font-medium"
                />
              </div>

              {/* 2. Email */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-pink" /> Email address <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-white border border-brand-purple/20 rounded-2xl px-5 py-4 text-brand-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all placeholder:text-brand-purple/40 shadow-sm font-medium"
                />
              </div>

              {/* 3. Phone Number */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-pink" /> Phone number <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-brand-purple/20 rounded-2xl px-5 py-4 text-brand-purple focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all placeholder:text-brand-purple/40 shadow-sm font-medium"
                />
              </div>

              {/* 4. Proficiency - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-brand-pink" /> How would you rate your skills? <span className="text-brand-pink">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Beginner', 'Amateur', 'Advanced', 'Professional'].map((level) => (
                    <div
                      key={level}
                      onClick={() => handleSelect('proficiency', level)}
                      className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all duration-200 font-bold ${
                        formData.proficiency === level 
                        ? 'border-brand-purple bg-brand-yellow text-brand-purple shadow-sm' 
                        : 'border-transparent bg-white border-brand-purple/10 text-brand-purple/70 hover:bg-brand-purple/5 hover:text-brand-purple shadow-sm'
                      }`}
                    >
                      <span className="text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Duration - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-pink" /> How long have you been playing? <span className="text-brand-pink">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['< 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((time) => (
                    <div
                      key={time}
                      onClick={() => handleSelect('duration', time)}
                      className={`cursor-pointer rounded-2xl p-3 text-center border-2 transition-all duration-200 flex items-center justify-center font-bold ${
                        formData.duration === time 
                        ? 'border-brand-purple bg-brand-yellow text-brand-purple shadow-sm' 
                        : 'border-transparent bg-white border-brand-purple/10 text-brand-purple/70 hover:bg-brand-purple/5 hover:text-brand-purple shadow-sm'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Non-marking shoes - Pill Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-brand-purple ml-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-pink" /> Do you have non-marking shoes? <span className="text-brand-pink">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((ans) => (
                    <div
                      key={ans}
                      onClick={() => handleSelect('shoes', ans)}
                      className={`cursor-pointer flex-1 rounded-2xl py-4 text-center border-2 transition-all duration-200 ${
                        formData.shoes === ans 
                        ? 'border-brand-purple bg-brand-yellow text-brand-purple shadow-sm' 
                        : 'border-transparent bg-white border-brand-purple/10 text-brand-purple/70 hover:bg-brand-purple/5 hover:text-brand-purple shadow-sm'
                      }`}
                    >
                      <span className="font-extrabold text-lg">{ans}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Heard From */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-brand-purple ml-1">
                  How did you find us? <span className="text-brand-pink">*</span>
                </label>
                <div className="relative">
                  <select
                    name="heardFrom"
                    value={formData.heardFrom}
                    onChange={handleChange}
                    className="w-full bg-white border border-brand-purple/20 rounded-2xl px-5 py-4 text-brand-purple font-medium focus:outline-none focus:ring-4 focus:ring-brand-purple/10 focus:border-brand-purple transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="" disabled className="text-brand-purple/40">Select an option...</option>
                    <option value="Friend/Word of Mouth">Friend / Word of Mouth</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-brand-purple/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-8 mt-10 border-t border-brand-purple/10">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-brand-purple hover:bg-[#2A1244] text-brand-yellow-light font-extrabold text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(58,26,93,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_12px_25px_rgba(58,26,93,0.4)] hover:-translate-y-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Securing your spot...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Pay
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
}
