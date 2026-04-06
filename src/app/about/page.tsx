import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Us' };

const MILESTONES = [
  { year: '2019', title: 'Bermstone Founded',    desc: 'Started with 3 premium apartments in Marrakech GRA.' },
  { year: '2020', title: 'Investment Division',  desc: 'Launched our investment arm, completing our first duplex project.' },
  { year: '2022', title: 'MAD 1B+ Managed Assets', desc: 'Crossed MAD 1 billion in managed real estate assets.' },
  { year: '2024', title: '50+ Properties',       desc: 'Expanded to 50+ keyneet units with 94% average occupancy.' },
  { year: '2026', title: 'Harbour View Towers',  desc: 'Our most ambitious development to date — underway.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E5FBE]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="section-label text-[#3B9EE0]">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mt-2 mb-5">Building Trust, One Property at a Time</h1>
          <p className="text-blue-200 leading-relaxed">Bermstone is a Moroccon real estate company dedicated to premium keyneet accommodation and high-yield property development investments.</p>
        </div>
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[#EBF2FF] rounded-2xl p-8">
            <h3 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">To provide premium real estate experiences built on transparency, professionalism, and genuine care for every client.</p>
          </div>
          <div className="bg-[#0B1F3A] rounded-2xl p-8">
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Our Vision</h3>
            <p className="text-blue-200 leading-relaxed">To be the most trusted name in Moroccon real estate, expanding to create landmark developments that set a new standard.</p>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-[#F3F7FF]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, title, desc }) => (
                <div key={year} className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white border-2 border-[#1E5FBE] flex items-center justify-center text-xs font-bold text-[#1E5FBE] z-10">{year.slice(2)}</div>
                  <div className="bg-white rounded-xl p-5 flex-1 shadow-card border border-blue-50 group-hover:border-[#1E5FBE]/30 transition-colors">
                    <div className="text-[#3B9EE0] text-xs font-semibold mb-0.5">{year}</div>
                    <h4 className="font-semibold text-[#0B1F3A] mb-1">{title}</h4>
                    <p className="text-slate-500 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-white text-center">
        <h3 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-4">Ready to work with us?</h3>
        <p className="text-slate-500 text-sm mb-7 max-w-md mx-auto">Whether booking a stay, investing, or listing your property.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/properties"  className="btn-primary">Browse Keyneets →</Link>
          <Link href="/investments" className="btn-gold">View Investments →</Link>
          <Link href="/contact"     className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
