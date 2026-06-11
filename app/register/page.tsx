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
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=10b981&bgcolor=0a0a0a&data=${encodeURIComponent(ticketData.qrId)}`;
    
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              You're In, {ticketData.name}! 🎉
            </h1>
            <p className="text-neutral-400 text-sm">
              We've emailed you a copy of your ticket. Get ready for an amazing weekend!
            </p>
          </div>

          <div className="bg-black/50 p-4 rounded-3xl inline-block shadow-inner mx-auto border border-neutral-800 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="Your QR Code Ticket" 
              className="w-64 h-64 object-contain rounded-xl"
            />
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-400/90 text-sm font-medium leading-relaxed">
              Take a quick screenshot of this code to show at the entrance!
            </p>
          </div>

          <button
            onClick={() => {
              setTicketData(null);
              setFormData({ name: '', email: '', phone: '', proficiency: '', duration: '', shoes: '', heardFrom: '' });
            }}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-2xl transition-all border border-neutral-700"
          >
            Register another player
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 flex flex-col items-center justify-center selection:bg-emerald-500/30">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <header className="mb-10 flex flex-col items-center justify-center pt-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center font-black text-black shadow-[0_0_40px_rgba(16,185,129,0.3)] mb-6 rotate-3 hover:rotate-6 transition-transform">
            <span className="text-2xl">WB</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
            The Weekend Baddie
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Your complimentary trial awaits
          </div>
        </header>

        {/* Form Container */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
              <Smile className="w-6 h-6 text-emerald-400" /> Let's get to know you
            </h2>
            <p className="text-neutral-400 text-sm">
              We just need a few details to customize your experience.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              
              {/* 1. Full Name */}
              <div className="space-y-3 md:col-span-2 group">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" /> What's your full name? <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-600 shadow-inner"
                />
              </div>

              {/* 2. Email */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" /> Email address <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-600 shadow-inner"
                />
              </div>

              {/* 3. Phone Number */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" /> Phone number <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-600 shadow-inner"
                />
              </div>

              {/* 4. Proficiency - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> How would you rate your skills? <span className="text-emerald-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Beginner', 'Amateur', 'Advanced', 'Professional'].map((level) => (
                    <div
                      key={level}
                      onClick={() => handleSelect('proficiency', level)}
                      className={`cursor-pointer rounded-2xl p-4 text-center border transition-all duration-200 ${
                        formData.proficiency === level 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="font-medium text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Duration - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" /> How long have you been playing? <span className="text-emerald-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['< 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((time) => (
                    <div
                      key={time}
                      onClick={() => handleSelect('duration', time)}
                      className={`cursor-pointer rounded-2xl p-3 text-center border transition-all duration-200 flex items-center justify-center ${
                        formData.duration === time 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="font-medium text-xs sm:text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Non-marking shoes - Pill Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-neutral-300 ml-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" /> Do you have non-marking shoes? <span className="text-emerald-500">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((ans) => (
                    <div
                      key={ans}
                      onClick={() => handleSelect('shoes', ans)}
                      className={`cursor-pointer flex-1 rounded-2xl py-4 text-center border transition-all duration-200 ${
                        formData.shoes === ans 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="font-bold text-lg">{ans}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Heard From */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold text-neutral-300 ml-1">
                  How did you find us? <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="heardFrom"
                    value={formData.heardFrom}
                    onChange={handleChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="" disabled className="text-neutral-600">Select an option...</option>
                    <option value="Friend/Word of Mouth">Friend / Word of Mouth</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-8 mt-10 border-t border-neutral-800">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                    Securing your spot...
                  </>
                ) : (
                  'Complete Registration 🎉'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-neutral-600 text-sm mt-8 pb-8">
          © {new Date().getFullYear()} The Weekend Baddie. All rights reserved.
        </p>
      </div>
    </div>
  );
}
