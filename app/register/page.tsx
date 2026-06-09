'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, Sparkles, Smile, Trophy, Clock, Zap } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    proficiency: '',
    duration: '',
    gear: '',
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
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketData.qrId)}`;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-white text-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              You're In, {ticketData.name}! 🎉
            </h1>
            <p className="text-slate-500">
              We've emailed you a copy of your ticket. Get ready for an amazing weekend!
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl inline-block shadow-lg mx-auto border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="Your QR Code Ticket" 
              className="w-64 h-64 object-contain rounded-xl"
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-emerald-700 text-sm font-medium">
              📸 Take a quick screenshot of this code to show at the entrance!
            </p>
          </div>

          <button
            onClick={() => {
              setTicketData(null);
              setFormData({ name: '', email: '', age: '', proficiency: '', duration: '', gear: '', heardFrom: '' });
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
          >
            Register a Friend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900 p-4 sm:p-8 flex justify-center selection:bg-emerald-200">
      <div className="max-w-2xl w-full">
        
        {/* Header - No Organizer Login */}
        <header className="mb-10 flex flex-col items-center justify-center pt-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center font-black text-white shadow-lg mb-4 rotate-3 hover:rotate-6 transition-transform">
            <span className="text-2xl">WB</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            The Weekend Baddie
          </h1>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Your complimentary trial awaits
          </p>
        </header>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl -z-10" />
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800">
              <Smile className="w-6 h-6 text-emerald-500" /> Let's get to know you
            </h2>
            <p className="text-slate-500 text-sm">
              We just need a few details to customize your experience.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              
              {/* Full Name */}
              <div className="space-y-3 md:col-span-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  What's your full name? <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Your email address <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Age */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  How old are you? <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Heard From */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  How did you find us?
                </label>
                <select
                  name="heardFrom"
                  value={formData.heardFrom}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Select an option...</option>
                  <option value="Friend/Word of Mouth">Friend / Word of Mouth</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Proficiency - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> How would you rate your skills? <span className="text-emerald-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Beginner', 'Amateur', 'Advanced', 'Professional'].map((level) => (
                    <div
                      key={level}
                      onClick={() => handleSelect('proficiency', level)}
                      className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all duration-300 ${
                        formData.proficiency === level 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration - Card Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> How long have you been playing? <span className="text-emerald-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['< 1 year', '1-3 years', '3-5 years', '5-10 years'].map((time) => (
                    <div
                      key={time}
                      onClick={() => handleSelect('duration', time)}
                      className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all duration-300 ${
                        formData.duration === time 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium text-sm">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gear - Pill Selection */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" /> Do you have non-marking shoes and a racket? <span className="text-emerald-500">*</span>
                </label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((ans) => (
                    <div
                      key={ans}
                      onClick={() => handleSelect('gear', ans)}
                      className={`cursor-pointer flex-1 rounded-2xl py-4 text-center border-2 transition-all duration-300 ${
                        formData.gear === ans 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-lg">{ans}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 mt-10 border-t border-slate-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-lg rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
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
      </div>
    </div>
  );
}
