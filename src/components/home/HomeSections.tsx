import Link from 'next/link';

export function StatsSection() {
  const stats = [
    { value: '50+',  label: 'Premium Properties' },
    { value: '₦2B+', label: 'Investment Value' },
    { value: '98%',  label: 'Client Satisfaction' },
    { value: '5+',   label: 'Years of Excellence' },
  ];
  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl lg:text-5xl font-bold text-[#1E5FBE] mb-1">{value}</div>
              <div className="text-slate-500 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  const reasons = [
    { icon: '🛡️', title: 'Fully Verified Properties',      desc: 'Every property is physically inspected and legally verified before listing.' },
    { icon: '📈', title: 'Transparent Investment Returns', desc: 'Detailed business plans, building plans, and ROI projections for every project.' },
    { icon: '🎧', title: '24/7 Concierge Support',         desc: 'Our dedicated team ensures every guest experience is flawless from check-in to check-out.' },
    { icon: '🔑', title: 'Seamless Booking',               desc: 'Direct booking with no unnecessary fees. Fast confirmation and easy communication.' },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Why Bermstone</span>
          <h2 className="section-title">Built on Trust. Driven by Excellence.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map(({ icon, title, desc }) => (
            <div key={title} className="group flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-[#EBF2FF] flex items-center justify-center mb-4 text-2xl group-hover:bg-[#1E5FBE] transition-colors duration-300">{icon}</div>
              <h3 className="font-display font-semibold text-lg text-[#0B1F3A] mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const items = [
    { name: 'Chukwuemeka Obi',   role: 'Investor',           country: 'Nigeria', avatar: 'CO', rating: 5, text: 'Bermstone gave me complete confidence in my first real estate investment. Returns have been exactly as projected.' },
    { name: 'Sarah Mitchell',     role: 'Frequent Guest',     country: 'UK',      avatar: 'SM', rating: 5, text: 'Every time I visit Port Harcourt for work, I stay at a Bermstone property. Consistently exceptional quality.' },
    { name: 'Adaeze Nwosu',       role: 'Property Owner',     country: 'Nigeria', avatar: 'AN', rating: 5, text: 'Handing my property to Bermstone was the best decision I made. Occupancy went from 40% to 85% in three months.' },
    { name: 'James Okafor',       role: 'Corporate Traveller', country: 'Nigeria', avatar: 'JO', rating: 5, text: 'My clients said it felt like a 5-star hotel with all the comforts of home. Bermstone delivered perfectly.' },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">Trusted by Guests &amp; Investors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(({ name, role, country, avatar, rating, text }) => (
            <div key={name} className="relative bg-[#F8FAFF] rounded-2xl p-7 border border-blue-50">
              <div className="text-5xl absolute top-5 right-6 text-[#1E5FBE]/10 font-serif leading-none">&ldquo;</div>
              <div className="flex gap-1 mb-4">{Array.from({ length: rating }).map((_, i) => <span key={i} className="text-[#C9A84C]">★</span>)}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E5FBE] flex items-center justify-center text-white text-sm font-semibold">{avatar}</div>
                <div>
                  <div className="font-semibold text-[#0B1F3A] text-sm">{name}</div>
                  <div className="text-slate-400 text-xs">{role} · {country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OwnerCTA() {
  return (
    <section className="py-20 bg-[#0B1F3A] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E5FBE]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-5">🏠</div>
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Own a Property?</h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">Let Bermstone manage your property and maximise your rental income. We handle everything while you earn consistently.</p>
            <ul className="space-y-2 mb-7">
              {['Higher occupancy rates','Professional guest management','Regular transparent reporting','No hidden fees'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="w-1.5 h-1.5 bg-[#3B9EE0] rounded-full shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/owner-support" className="btn-primary inline-flex">List Your Property →</Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-3xl mb-5">📈</div>
            <h3 className="font-display text-2xl font-semibold text-white mb-3">Ready to Invest?</h3>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">Join investors funding landmark real estate developments. Choose your project and earn returns backed by detailed business plans.</p>
            <ul className="space-y-2 mb-7">
              {['Up to 35% expected ROI','Full project transparency','Business & building plans provided','Track investment progress'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shrink-0" />{item}
                </li>
              ))}
            </ul>
            <Link href="/investments" className="btn-gold inline-flex">Explore Investments →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
