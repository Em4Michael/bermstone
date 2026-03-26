'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, TrendingUp, CalendarCheck, MessageSquare, Star, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin',             label: 'Overview',    Icon: LayoutDashboard },
  { href: '/admin/properties',  label: 'Properties',  Icon: Building2 },
  { href: '/admin/investments', label: 'Investments', Icon: TrendingUp },
  { href: '/admin/bookings',    label: 'Bookings',    Icon: CalendarCheck },
  { href: '/admin/inquiries',   label: 'Inquiries',   Icon: MessageSquare },
  { href: '/admin/reviews',     label: 'Reviews',     Icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace('/admin/login');
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B1F3A] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-[#1E5FBE] rounded-lg flex items-center justify-center font-bold text-sm">B</span>
            <div>
              <div className="font-display font-semibold text-sm">Bermstone</div>
              <div className="text-blue-300 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                pathname === href ? 'bg-[#1E5FBE] text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white')}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#1E5FBE] flex items-center justify-center text-xs font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <div className="text-white text-xs font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-blue-300 text-[10px]">Administrator</div>
            </div>
          </div>
          <button onClick={() => { logout(); router.replace('/'); }}
            className="flex items-center gap-2 px-3 py-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg text-sm w-full transition-colors">
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0B1F3A] text-white z-50 flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <span className="font-display font-semibold text-white">Bermstone Admin</span>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV.map(({ href, label, Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                    pathname === href ? 'bg-[#1E5FBE] text-white' : 'text-blue-200 hover:bg-white/10')}>
                  <Icon size={16} />{label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)}><Menu size={20} /></button>
          <span className="font-display font-semibold text-[#0B1F3A]">Admin Panel</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
