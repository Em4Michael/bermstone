import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const LINKS = [
  { href: '/properties',    label: 'Shortlet Apartments' },
  { href: '/investments',   label: 'Investment Opportunities' },
  { href: '/about',         label: 'About Bermstone' },
  { href: '/owner-support', label: 'List Your Property' },
  { href: '/customer-care', label: 'Concierge Services' },
  { href: '/contact',       label: 'Get in Touch' },
];
const LEGAL   = [
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
    <footer className="bg-[#0B1F3A] text-white">
      <div className="bg-[#1E5FBE] py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-1">Ready to invest or book your stay?</h3>
            <p className="text-blue-100 text-sm">Let&apos;s help you find the perfect opportunity.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/properties"  className="btn-gold whitespace-nowrap">Browse Shortlets</Link>
            <Link href="/investments" className="btn-secondary border-white text-white hover:bg-white hover:text-[#1E5FBE] whitespace-nowrap">View Investments</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-[#1E5FBE] flex items-center justify-center text-white text-lg font-bold">B</span>
              <span className="font-display text-2xl font-semibold text-white">Bermstone</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">Premium shortlets and real estate investments. Building trust, one property at a time.</p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1E5FBE] transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              {LINKS.map((l) => <li key={l.href}><Link href={l.href} className="text-blue-200 text-sm hover:text-white transition-colors">{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => <li key={l.href}><Link href={l.href} className="text-blue-200 text-sm hover:text-white transition-colors">{l.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-blue-200 text-sm"><MapPin size={15} className="mt-0.5 shrink-0 text-[#3B9EE0]" /><span>Port Harcourt, Rivers State, Nigeria</span></li>
              <li><a href="tel:+2348000000000" className="flex items-center gap-2.5 text-blue-200 text-sm hover:text-white"><Phone size={15} className="shrink-0 text-[#3B9EE0]" />+234 800 000 0000</a></li>
              <li><a href="mailto:hello@bermstone.com" className="flex items-center gap-2.5 text-blue-200 text-sm hover:text-white"><Mail size={15} className="shrink-0 text-[#3B9EE0]" />hello@bermstone.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-300">
          <p>© {new Date().getFullYear()} Bermstone. All rights reserved.</p>
          <p>Built with trust. Designed for excellence.</p>
        </div>
      </div>
    </footer>
  );
}
