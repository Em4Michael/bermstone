'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Phone, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/',              label: 'Home' },
  { href: '/properties',    label: 'Shortlets' },
  { href: '/investments',   label: 'Invest' },
  { href: '/about',         label: 'About' },
  { href: '/owner-support', label: 'Owner Support' },
  { href: '/customer-care', label: 'Concierge' },
  { href: '/contact',       label: 'Contact' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const solid   = !isHome || scrolled;
  const navBg   = solid ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-50' : 'bg-transparent';
  const textClr = solid ? 'text-[#0B1F3A]' : 'text-white';

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/');
  };

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', navBg)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className={cn('flex items-center gap-2 font-display font-semibold text-2xl', solid ? 'text-[#1E5FBE]' : 'text-white')}>
            <span className="w-9 h-9 rounded-lg bg-[#1E5FBE] flex items-center justify-center text-white text-lg font-bold">B</span>
            Bermstone
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn('px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200', textClr,
                  pathname === href ? 'bg-[#1E5FBE]/10 !text-[#1E5FBE]' : 'hover:bg-white/10')}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right: phone + auth */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+2348000000000" className={cn('flex items-center gap-1.5 text-sm font-medium opacity-80 hover:opacity-100', textClr)}>
              <Phone size={15} /><span>+234 800 000 0000</span>
            </a>

            {user ? (
              /* ── Logged-in profile menu ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium',
                    solid ? 'border-slate-200 text-[#0B1F3A] hover:border-[#1E5FBE]' : 'border-white/30 text-white hover:bg-white/10')}
                >
                  <div className="w-7 h-7 rounded-full bg-[#1E5FBE] flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span>{user.firstName}</span>
                  <ChevronDown size={14} className={cn('transition-transform', profileOpen && 'rotate-180')} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-card-lg border border-slate-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-[#0B1F3A] text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-slate-400 text-xs capitalize">{user.role}</p>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1E5FBE] hover:bg-blue-50 transition-colors font-medium">
                        <LayoutDashboard size={15} />Admin Dashboard
                      </Link>
                    )}
                    <Link href="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={15} />My Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                        <LogOut size={15} />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Logged-out buttons ── */
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className={cn('px-4 py-2 text-sm font-medium rounded-lg border transition-all',
                    solid ? 'border-slate-200 text-[#0B1F3A] hover:border-[#1E5FBE] hover:text-[#1E5FBE]' : 'border-white/30 text-white hover:bg-white/10')}>
                  Sign In
                </Link>
                <Link href="/properties" className="btn-primary text-sm py-2.5 px-5">Book a Stay</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={cn('lg:hidden p-2 rounded-lg', textClr)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-blue-50',
        menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0')}>
        <nav className="px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className={cn('px-4 py-3 text-sm font-medium rounded-lg text-[#0B1F3A] transition-colors',
                pathname === href ? 'bg-blue-50 text-[#1E5FBE]' : 'hover:bg-slate-50')}>
              {label}
            </Link>
          ))}

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E5FBE] flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F3A]">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1E5FBE] font-medium rounded-lg hover:bg-blue-50">
                    <LayoutDashboard size={15} />Admin Dashboard
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-slate-50">
                  <User size={15} />My Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50 w-full">
                  <LogOut size={15} />Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login"    className="btn-secondary w-full text-sm text-center">Sign In</Link>
                <Link href="/register" className="btn-primary  w-full text-sm text-center">Create Account</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
