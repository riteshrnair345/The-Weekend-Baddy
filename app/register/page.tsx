'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, Sparkles, Smile, Trophy, Clock, Zap, Phone, Mail, User, Info } from 'lucide-react';

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.proficiency || !formData.duration || !formData.shoes || !formData.heardFrom) {
      setError("Please fill out all fields before continuing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setTicketData({ qrId: data.qrId, name: data.name });
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (ticketData) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=6366f1&bgcolor=ffffff&data=${encodeURIComponent(ticketData.qrId)}`;
    
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col items-center justify-center p-4 selection:bg-indigo-200 relative overflow-hidden">
        {/* Soft Background Image */}
        <div className="absolute inset-0 bg-[url('/badminton-bg.png')] bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none mix-blend-multiply" />

        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 text-center space-y-6 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative z-10">
          
          <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
            <CheckCircle className="w-10 h-10 text-indigo-500" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-800">
              You're In, {ticketData.name}! 🎉
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              We've emailed you a copy of your ticket. Get ready for an amazing weekend!
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

          <div className="bg-indigo-50 border border-indigo-100/50 rounded-2xl p-4 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-indigo-700 text-sm font-medium leading-relaxed">
              Take a quick screenshot of this code to show at the entrance!
            </p>
          </div>

          <button
            onClick={() => {
              setTicketData(null);
              setFormData({ name: '', email: '', phone: '', proficiency: '', duration: '', shoes: '', heardFrom: '' });
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
    <div className="min-h-screen bg-[#fafafa] text-slate-800 p-4 sm:p-8 flex flex-col items-center justify-center selection:bg-indigo-200 relative overflow-hidden">
      
      {/* Soft Background Image */}
      <div className="absolute inset-0 bg-[url('/badminton-bg.png')] bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none mix-blend-multiply" />

      <div className="max-w-2xl w-full relative z-10 pt-4">
        
        {/* Header */}
        <header className="mb-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center font-black text-indigo-500 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 mb-6 rotate-3 hover:rotate-6 transition-transform">
            <span className="text-2xl">WB</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 mb-3 text-center">
            The Weekend Baddie
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4" />
            Your complimentary trial awaits
          </div>
        </header>

        {/* Form Container */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800">
              <Smile className="w-6 h-6 text-indigo-500" /> Let's get to know you
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              We just need a few details to customize your experience.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3 shadow-sm">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              
              {/* 1. Full Name */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" /> What's your full name? <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400 shadow-sm font-medium"
                />
              </div>

              {/* 2. Email */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" /> Email address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400 shadow-sm font-medium"
                />
              </div>

              {/* 3. Phone Number */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-400" /> Phone number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400 shadow-sm font-medium"
                />
              </div>

              {/* 4. Proficiency - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> How would you rate your skills? <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Beginner', 'Amateur', 'Advanced', 'Professional'].map((level) => (
                    <div
                      key={level}
                      onClick={() => handleSelect('proficiency', level)}
                      className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all duration-200 font-bold ${
                        formData.proficiency === level 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-sm'
                      }`}
                    >
                      <span className="text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Duration - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" /> How long have you been playing? <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['< 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((time) => (
                    <div
                      key={time}
                      onClick={() => handleSelect('duration', time)}
                      className={`cursor-pointer rounded-2xl p-3 text-center border-2 transition-all duration-200 flex items-center justify-center font-bold ${
                        formData.duration === time 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-sm'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Non-marking shoes - Pill Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" /> Do you have non-marking shoes? <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((ans) => (
                    <div
                      key={ans}
                      onClick={() => handleSelect('shoes', ans)}
                      className={`cursor-pointer flex-1 rounded-2xl py-4 text-center border-2 transition-all duration-200 ${
                        formData.shoes === ans 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-sm'
                      }`}
                    >
                      <span className="font-extrabold text-lg">{ans}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Heard From */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  How did you find us? <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    name="heardFrom"
                    value={formData.heardFrom}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="" disabled className="text-slate-400">Select an option...</option>
                    <option value="Friend/Word of Mouth">Friend / Word of Mouth</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-8 mt-10 border-t border-slate-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-lg rounded-2xl transition-all shadow-[0_8px_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_12px_25px_rgba(99,102,241,0.4)] hover:-translate-y-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Securing your spot...
                  </>
                ) : (
                  'Complete Registration 🎉'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-sm font-medium mt-8 pb-8">
          © {new Date().getFullYear()} The Weekend Baddie. All rights reserved.
        </p>
      </div>
    </div>
  );
}
