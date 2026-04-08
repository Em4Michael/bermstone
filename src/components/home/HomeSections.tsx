import Link from "next/link";

export function StatsSection() {
  const stats = [
    { value: "50+", label: "Premium keyneet", icon: "🏠" },
    { value: "₦2B+", label: "Investment Value", icon: "💰" },
    { value: "98%", label: "Client Satisfaction", icon: "⭐" },
    { value: "5+", label: "Years of Excellence", icon: "🏆" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(30,95,190,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="text-center group cursor-default">
              <div
                className="text-3xl mb-2 animate-float inline-block"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              >
                {icon}
              </div>
              <div className="font-display text-4xl lg:text-5xl font-bold text-[#1E5FBE] mb-1 group-hover:text-[#0B1F3A] transition-colors">
                {value}
              </div>
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
    {
      icon: "🛡️",
      title: "Fully Verified keyneet",
      desc: "Every property is physically inspected and legally verified before listing on Bermstone.",
    },
    {
      icon: "📈",
      title: "Transparent Investment Returns",
      desc: "Detailed business plans, building plans, and clear ROI projections for every project.",
    },
    {
      icon: "🎧",
      title: "24/7 Concierge Support",
      desc: "Our dedicated team ensures every guest experience is flawless from check-in to check-out.",
    },
    {
      icon: "🔑",
      title: "Seamless Booking",
      desc: "Direct booking with no unnecessary fees. Fast confirmation and clear communication.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #1E5FBE, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="section-label">Why Bermstone</span>
          <h2 className="section-title mt-1">
            Built on Trust. Driven by Excellence.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
          {reasons.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-transparent hover:border-[#1E5FBE]/20 hover:bg-[#F8FAFF] transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-[#EBF2FF] flex items-center justify-center mb-5 text-2xl
                group-hover:bg-[#1E5FBE] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200"
              >
                <span className="group-hover:grayscale-0 transition-all">
                  {icon}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg text-[#0B1F3A] mb-2 group-hover:text-[#1E5FBE] transition-colors">
                {title}
              </h3>
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
    {
      name: "Chukwuemeka Obi",
      role: "Investor",
      country: "Nigeria",
      avatar: "CO",
      rating: 5,
      text: "Bermstone gave me complete confidence in my first real estate investment. Returns have been exactly as projected.",
    },
    {
      name: "Sarah Mitchell",
      role: "Frequent Guest",
      country: "UK",
      avatar: "SM",
      rating: 5,
      text: "Every time I visit Port Harcourt for work, I stay at a Bermstone property. Consistently exceptional quality.",
    },
    {
      name: "Adaeze Nwosu",
      role: "Property Owner",
      country: "Nigeria",
      avatar: "AN",
      rating: 5,
      text: "Handing my property to Bermstone was the best decision I made. Occupancy went from 40% to 85% in three months.",
    },
    {
      name: "James Okafor",
      role: "Corporate Traveller",
      country: "Nigeria",
      avatar: "JO",
      rating: 5,
      text: "My clients said it felt like a 5-star hotel with all the comforts of home. Bermstone delivered perfectly.",
    },
  ];

  return (
    <section className="py-24 bg-[#FAFBFF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title mt-1">
            Trusted by Guests &amp; Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-stagger">
          {items.map(({ name, role, country, avatar, rating, text }) => (
            <div
              key={name}
              className="relative bg-white rounded-3xl p-8 border border-blue-50 shadow-[0_4px_24px_rgba(11,31,58,0.06)]
                hover:shadow-[0_12px_40px_rgba(11,31,58,0.12)] hover:-translate-y-1 transition-all duration-400 group"
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 font-serif text-[80px] text-[#1E5FBE]/8 leading-none select-none group-hover:text-[#1E5FBE]/12 transition-colors">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-[#C9A84C] text-sm">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10 italic">
                &ldquo;{text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E5FBE] to-[#3B9EE0] flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#0B1F3A] text-sm">
                    {name}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {role} · {country}
                  </div>
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
    <section className="py-24 bg-[#0B1F3A] overflow-hidden relative">
      {/* Animated background orbs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none animate-float-slow"
        style={{
          background: "radial-gradient(circle, #1E5FBE, transparent)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none animate-float"
        style={{
          background: "radial-gradient(circle, #C9A84C, transparent)",
          filter: "blur(50px)",
          animationDelay: "2s",
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-stagger">
          {/* Owner card */}
          <div className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-3xl p-9 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/30">
            <div className="absolute top-6 right-6 text-4xl opacity-20 group-hover:opacity-40 transition-opacity animate-float">
              🏠
            </div>
            <div className="mb-6">
              <span className="inline-block bg-[#1E5FBE]/20 border border-[#1E5FBE]/30 text-[#3B9EE0] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Property Owners
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3">
                Own a Property?
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Let Bermstone manage your property and maximise your rental
                income. We handle everything while you earn consistently.
              </p>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                "Higher occupancy rates",
                "Professional guest management",
                "Regular transparent reporting",
                "No hidden fees",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-blue-100"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1E5FBE]/30 flex items-center justify-center shrink-0">
                    <span className="text-[#3B9EE0] text-xs">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/owner-support"
              className="group/btn flex items-center gap-2 bg-[#1E5FBE] hover:bg-[#2568cc] text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 w-fit text-sm shadow-lg shadow-blue-900/30"
            >
              List Your Property
              <span className="group-hover/btn:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Investor card */}
          <div className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#C9A84C]/30 rounded-3xl p-9 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-900/20">
            <div
              className="absolute top-6 right-6 text-4xl opacity-20 group-hover:opacity-40 transition-opacity animate-float"
              style={{ animationDelay: "1s" }}
            >
              📈
            </div>
            <div className="mb-6">
              <span className="inline-block bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Real Estate Investors
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3">
                Ready to Invest?
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Join investors funding landmark developments. Choose your
                project and earn returns backed by detailed business plans.
              </p>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                "Up to 45% expected ROI",
                "Full project transparency",
                "Business & building plans provided",
                "Track your investment progress",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-blue-100"
                >
                  <span className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#C9A84C] text-xs">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/investments"
              className="group/btn flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 w-fit text-sm shadow-lg shadow-yellow-900/20"
            >
              Explore Investments
              <span className="group-hover/btn:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
