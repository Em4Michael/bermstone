import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/keyneet',    label: 'Keyneet Apartments' },
  { href: '/investments',   label: 'Investment Projects' },
  { href: '/about',         label: 'About Bermstone' },
  { href: '/owner-support', label: 'List Your Property' },
  { href: '/customer-care', label: 'Concierge Services' },
  { href: '/contact',       label: 'Get in Touch' },
];
const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms',   label: 'Terms & Conditions' },
  { href: '/legal',   label: 'Legal Notice' },
  { href: '/faq',     label: 'FAQ' },
];
const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter,   href: '#', label: 'Twitter' },
  { Icon: Facebook,  href: '#', label: 'Facebook' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A]">

      {/* CTA Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E5FBE] to-[#163669] py-14 px-4">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 pointer-events-none animate-float-slow"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent)', filter: 'blur(50px)' }} />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-1">
              Ready to invest or book your stay?
            </h3>
            <p className="text-blue-200 text-sm">Let&apos;s help you find the perfect opportunity.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/keyneet"
              className="group flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-white font-medium px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap">
              Browse Keyneets
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/investments"
              className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-5 py-3 rounded-xl transition-all text-sm whitespace-nowrap">
              View Investments
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-10 h-10 rounded-xl bg-[#1E5FBE] flex items-center justify-center text-white text-lg font-bold shadow-lg">B</span>
              <span className="font-display text-2xl font-semibold text-white">Bermstone</span>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              Premium keyneet apartments and real estate investments. Building trust, one property at a time.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-blue-300 hover:text-white hover:bg-[#1E5FBE] hover:border-[#1E5FBE] transition-all duration-300 hover:scale-110">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="group flex items-center gap-2 text-blue-200/70 hover:text-white text-sm transition-all duration-200">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight size={10} className="text-[#C9A84C]" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="group flex items-center gap-2 text-blue-200/70 hover:text-white text-sm transition-all duration-200">
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                      <ArrowRight size={10} className="text-[#C9A84C]" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[#3B9EE0]" />
                </div>
                <span className="text-blue-200/70 text-sm leading-relaxed">Marrakech, Marrakech-Safi, Morocco</span>
              </li>
              <li>
                <a href="tel:+212600359326"
                  className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-[#1E5FBE] transition-colors">
                    <Phone size={14} className="text-[#3B9EE0]" />
                  </div>
                  <span className="text-blue-200/70 group-hover:text-white text-sm transition-colors">+212 600 359 326</span>
                </a>
              </li>
              <li>
                <a href="mailto:Realdelly@yahoo.com"
                  className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0 group-hover:bg-[#1E5FBE] transition-colors">
                    <Mail size={14} className="text-[#3B9EE0]" />
                  </div>
                  <span className="text-blue-200/70 group-hover:text-white text-sm transition-colors">Realdelly@yahoo.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300/50">
          <p>© {new Date().getFullYear()} Bermstone Real Estate Ltd. All rights reserved.</p>
          <p>Built with precision. Designed for excellence.</p>
        </div>
      </div>
    </footer>
  );
}
