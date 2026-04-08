import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Concierge Services' };

const SERVICES = [
  { icon: '🚗', title: 'Airport Transfers',   desc: 'Pre-arranged pickups and drop-offs with professional drivers.' },
  { icon: '🍳', title: 'In-Suite Dining',      desc: 'Private chef experiences, catered breakfasts, and meal deliveries.' },
  { icon: '🛒', title: 'Grocery & Shopping',   desc: 'Pre-arrival stocking of your apartment with preferred items.' },
  { icon: '✈️', title: 'Travel Arrangements', desc: 'Flight bookings, visa assistance, and itinerary planning.' },
  { icon: '💆', title: 'Wellness Services',   desc: 'In-suite massages, personal trainers, and spa bookings.' },
  { icon: '🔐', title: '24/7 Security',       desc: 'Round-the-clock security monitoring and emergency assistance.' },
];

export default function CustomerCarePage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-hero-gradient pt-14 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-sm text-white/90 mb-5">✦ Premium Concierge</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Your Personal Concierge</h1>
          <p className="text-white/75 leading-relaxed max-w-xl mx-auto">From arrival to departure, we ensure every detail is perfect.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a href="tel:+212600359326" className="btn-primary">📞 Call Concierge</a>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-[#1E5FBE]">💬 Message Us</Link>
          </div>
        </div>
      </div>
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Our Services</span>
            <h2 className="section-title">Everything You Need, Arranged</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES.map(({ icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-display text-lg font-semibold text-[#0B1F3A] mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#EBF2FF] py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-4xl mb-4">🕐</div>
          <h3 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-3">Available 24 / 7</h3>
          <p className="text-slate-600 text-sm mb-6">Reachable around the clock via phone, WhatsApp, and messaging.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:+212600359326" className="btn-primary text-sm">Call Now</a>
            <a href="https://wa.me/212600359326" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}