'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Users, TrendingUp, Home, ChevronDown } from 'lucide-react';

const WORDS = ['Luxury', 'Premium', 'Executive', 'Exclusive'];

// Floating particle
function Particle({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute rounded-full opacity-0 pointer-events-none"
      style={{
        width:  size,
        height: size,
        left:   `${left}%`,
        bottom: '-10px',
        background: `rgba(201,168,76,${0.2 + Math.random() * 0.3})`,
        animation: `particleDrift ${6 + Math.random() * 6}s ease-in ${delay}ms infinite`,
        filter: 'blur(1px)',
      }}
    />
  );
}

export default function HeroSection() {
  const router      = useRouter();
  const [city,   setCity]   = useState('');
  const [guests, setGuests] = useState('');
  const [mode,   setMode]   = useState<'keyneet' | 'invest'>('keyneet');
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing,    setTyping]    = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  // Typewriter
  useEffect(() => {
    const target = WORDS[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIdx]);

  // Parallax on scroll
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const orbs = el.querySelectorAll<HTMLElement>('.parallax-orb');
      orbs.forEach((orb, i) => {
        const speed = 0.15 + i * 0.08;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'keyneet') {
      const p = new URLSearchParams();
      if (city)   p.set('city', city);
      if (guests) p.set('maxGuests', guests);
      router.push(`/keyneet?${p.toString()}`);
    } else {
      router.push('/investments');
    }
  };

  const particles = Array.from({ length: 18 }, (_, i) => ({
    delay: i * 700,
    left:  5 + i * 5.5,
    size:  3 + Math.random() * 5,
  }));

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-animated-gradient noise" />

      {/* Floating orbs */}
      <div className="parallax-orb absolute top-[15%] left-[8%] w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1E5FBE, transparent)', filter: 'blur(40px)' }} />
      <div className="parallax-orb absolute top-[40%] right-[6%] w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)', filter: 'blur(50px)' }} />
      <div className="parallax-orb absolute bottom-[10%] left-[30%] w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3B9EE0, transparent)', filter: 'blur(40px)' }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-8">

        {/* Badge */}
        <div className="animate-blur-in delay-0 inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse-glow" />
          <span className="text-white/90 text-sm font-medium tracking-wide">Premium Real Estate · Morocco</span>
        </div>

        {/* Headline */}
        <div className="animate-fade-up delay-100 mb-4">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white leading-[1.05]">
            <span className="block">Where</span>
            <span className="block relative">
              <span className="text-gradient-gold text-glow-gold">{displayed}</span>
              <span className="text-[#C9A84C] opacity-80 animate-blink">|</span>
            </span>
            <span className="block italic font-light text-white/90">Meets Investment</span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="animate-fade-up delay-200 text-white/65 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover curated keyneet apartments and high-yield real estate projects across Morocco.
        </p>

        {/* Mode toggle */}
        <div className="animate-scale-in delay-300 inline-flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6 border border-white/15">
          {(['keyneet', 'invest'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                mode === m
                  ? 'bg-white text-[#0B1F3A] shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}>
              {m === 'keyneet' ? <Home size={15} /> : <TrendingUp size={15} />}
              {m === 'keyneet' ? 'Book a Keyneet' : 'Invest'}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <form onSubmit={onSearch}
          className="animate-tilt-in delay-400 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2.5 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mb-8">
          {mode === 'keyneet' ? (
            <>
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-slate-100 rounded-xl">
                <MapPin size={17} className="text-[#3B9EE0] shrink-0" />
                <input value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Which city? (Marrakech, Casablanca…)"
                  className="flex-1 text-sm text-[#0B1F3A] placeholder:text-slate-400 outline-none bg-transparent" />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-100 rounded-xl md:w-36">
                <Users size={17} className="text-[#3B9EE0] shrink-0" />
                <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)}
                  placeholder="Guests"
                  className="w-full text-sm text-[#0B1F3A] placeholder:text-slate-400 outline-none bg-transparent" />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-slate-100 rounded-xl">
              <TrendingUp size={17} className="text-[#C9A84C] shrink-0" />
              <span className="text-slate-400 text-sm">Browse open investment projects →</span>
            </div>
          )}
          <button type="submit" className="btn-primary md:px-8 whitespace-nowrap rounded-xl">
            <Search size={16} />
            {mode === 'keyneet' ? 'Search' : 'View Projects'}
          </button>
        </form>

        {/* City pills */}
        {mode === 'keyneet' && (
          <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-2">
            {['Marrakech', 'Casablanca', 'Rabat', 'Fès', 'Agadir'].map((c) => (
              <button key={c} onClick={() => setCity(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  city === c
                    ? 'bg-[#C9A84C] text-white border-[#C9A84C]'
                    : 'glass text-white/80 border-white/20 hover:bg-white/15'
                }`}>
                {c}
              </button>
            ))}
          </div>
        )}

        {mode === 'invest' && (
          <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {[['35%', 'Max ROI'], ['MAD 2B+', 'Managed'], ['5+', 'Years']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="font-display text-2xl font-semibold text-[#C9A84C]">{val}</div>
                <div className="text-white/50 text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-fade-up delay-700">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-float" />
        <ChevronDown size={16} className="animate-bounce" />
      </div>
    </section>
  );
}