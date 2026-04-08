"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  CalendarCheck,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/properties", label: "keyneet", Icon: Building2 },
  { href: "/admin/investments", label: "Investments", Icon: TrendingUp },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  {
    href: "/admin/investment-payments",
    label: "Invest. Payments",
    Icon: CreditCard,
  },
  { href: "/admin/inquiries", label: "Inquiries", Icon: MessageSquare },
  { href: "/admin/reviews", label: "Reviews", Icon: Star },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/login");
  }, [user, loading, isAdmin, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user || !isAdmin)
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const NavLinks = ({ onNav }: { onNav?: () => void }) => (
    <>
      {NAV.map(({ href, label, Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              active
                ? "bg-[#1E5FBE] text-white"
                : "text-blue-200 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon size={16} />
            {label}
            {active && (
              <ChevronRight size={12} className="ml-auto opacity-60" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B1F3A] text-white shrink-0 fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-[#1E5FBE] rounded-lg flex items-center justify-center font-bold text-sm">
              B
            </span>
            <div>
              <div className="font-display font-semibold text-sm">
                Bermstone
              </div>
              <div className="text-blue-300 text-xs">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#1E5FBE] flex items-center justify-center text-xs font-bold shrink-0">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-blue-300 text-[10px]">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg text-sm w-full transition-colors mt-1"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0B1F3A] text-white z-50 flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-[#1E5FBE] rounded-lg flex items-center justify-center font-bold text-sm">
                  B
                </span>
                <span className="font-display font-semibold text-white">
                  Admin Panel
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-blue-300 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLinks onNav={() => setOpen(false)} />
            </nav>

            {/* User info + logout — visible on mobile */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-[#1E5FBE] flex items-center justify-center text-sm font-bold shrink-0">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-blue-300 text-xs">Administrator</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-3 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg text-sm w-full transition-colors font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar — mobile + tablet */}
        <header className="lg:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-display font-semibold text-[#0B1F3A]">
              Admin Panel
            </span>
          </div>

          {/* Logout always visible in top bar on mobile */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
