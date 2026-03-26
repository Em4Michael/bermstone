'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Users } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [city,   setCity]   = useState('');
  const [guests, setGuests] = useState('');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city)   p.set('city', city);
    if (guests) p.set('maxGuests', guests);
    router.push(`/properties?${p.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#3B9EE0]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#C9A84C]/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
          Premium Real Estate — Nigeria
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-[1.1]">
          Where Luxury <br />
          <em className="text-[#3B9EE0]" style={{ fontStyle: 'italic' }}>Meets</em>{' '}Investment
        </h1>
        <p className="text-white/75 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover premium shortlet apartments and high-yield real estate investment opportunities across Nigeria.
        </p>

        <form onSubmit={onSearch} className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mb-8">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl">
            <MapPin size={18} className="text-[#3B9EE0] shrink-0" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Where to? (city)"
              className="flex-1 text-sm text-[#0B1F3A] placeholder:text-slate-400 outline-none bg-transparent" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl md:w-40">
            <Users size={18} className="text-[#3B9EE0] shrink-0" />
            <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Guests"
              className="w-full text-sm text-[#0B1F3A] placeholder:text-slate-400 outline-none bg-transparent" />
          </div>
          <button type="submit" className="btn-primary md:px-8 whitespace-nowrap">
            <Search size={16} />Search
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {['Port Harcourt','Lagos','Abuja','Lekki','Victoria Island'].map((c) => (
            <button key={c} onClick={() => setCity(c)}
              className="px-4 py-1.5 bg-white/15 border border-white/25 text-white rounded-full hover:bg-white/25 transition-colors text-xs">
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
        <span>Scroll to explore</span>
        <div className="w-0.5 h-8 bg-white/30 animate-bounce" />
      </div>
    </section>
  );
}
