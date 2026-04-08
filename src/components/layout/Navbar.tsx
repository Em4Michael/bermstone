"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Home,
  Building2,
  TrendingUp,
  Phone,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const KEYNEET_LINKS = [
  {
    href: "/keyneet",
    label: "Browse All Keyneets",
    desc: "View all available apartments",
  },
  {
    href: "/owner-support",
    label: "List Your Property",
    desc: "Partner with Bermstone",
  },
  {
    href: "/customer-care",
    label: "Concierge Services",
    desc: "24/7 guest support",
  },
];

const INVEST_LINKS = [
  {
    href: "/investments",
    label: "Browse Projects",
    desc: "View all investment opportunities",
  },
  {
    href: "/about",
    label: "About Bermstone",
    desc: "Our story and track record",
  },
  {
    href: "/contact",
    label: "Investment Enquiry",
    desc: "Speak to our investment team",
  },
];

function Dropdown({
  label,
  links,
  icon: Icon,
  pathname,
}: {
  label: string;
  links: { href: string; label: string; desc: string }[];
  icon: LucideIcon;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = links.some((l) => pathname.startsWith(l.href));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-[#1E5FBE]/10 text-[#1E5FBE]"
            : "text-[#0B1F3A] hover:bg-slate-100",
        )}
      >
        <Icon size={15} />
        {label}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-card-lg border border-blue-50 py-2 z-50 animate-fade-down">
          {links.map(({ href, label: lbl, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
            >
              <div className="w-2 h-2 bg-[#1E5FBE] rounded-full mt-1.5 shrink-0 group-hover:bg-[#C9A84C] transition-colors" />
              <div>
                <div className="text-sm font-medium text-[#0B1F3A] group-hover:text-[#1E5FBE] transition-colors">
                  {lbl}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const solid = !isHome || scrolled;
  const navBg = solid
    ? "bg-white/97 backdrop-blur-md shadow-md border-b border-blue-50"
    : "bg-transparent";
  const textClr = solid ? "text-[#0B1F3A]" : "text-white";

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        navBg,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 font-display font-semibold text-2xl transition-colors",
              solid ? "text-[#1E5FBE]" : "text-white",
            )}
          >
            <span className="w-9 h-9 rounded-xl bg-[#1E5FBE] flex items-center justify-center text-white text-lg font-bold shadow-md">
              B
            </span>
            Bermstone
          </Link>

          {/* Desktop nav — only 2 dropdowns + home */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all",
                pathname === "/"
                  ? "bg-[#1E5FBE]/10 text-[#1E5FBE]"
                  : `${textClr} hover:bg-slate-100/80`,
              )}
            >
              <Home size={15} />
              Home
            </Link>

            {/* Hide Keyneet tab when already on investments pages */}
            {!pathname.startsWith("/investments") &&
              !pathname.startsWith("/invest") && (
                <Dropdown
                  label="Keyneet"
                  links={KEYNEET_LINKS}
                  icon={Building2}
                  pathname={pathname}
                />
              )}
            {/* Hide Investments tab when already on keyneet/keyneet pages */}
            {!pathname.startsWith("/keyneet") && (
              <Dropdown
                label="Investments"
                links={INVEST_LINKS}
                icon={TrendingUp}
                pathname={pathname}
              />
            )}

            <Link
              href="/contact"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all",
                pathname === "/contact"
                  ? "bg-[#1E5FBE]/10 text-[#1E5FBE]"
                  : `${textClr} hover:bg-slate-100/80`,
              )}
            >
              <Phone size={15} />
              Contact
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium",
                    solid
                      ? "border-slate-200 text-[#0B1F3A] hover:border-[#1E5FBE] hover:bg-blue-50"
                      : "border-white/30 text-white hover:bg-white/10",
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-[#1E5FBE] flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  {user.firstName}
                  <ChevronDown
                    size={13}
                    className={cn(
                      "transition-transform",
                      profileOpen && "rotate-180",
                    )}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-lg border border-slate-100 py-1 z-50 animate-fade-down">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-[#0B1F3A] text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-slate-400 text-xs capitalize">
                        {user.role}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1E5FBE] hover:bg-blue-50 font-medium"
                      >
                        <LayoutDashboard size={15} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={15} />
                      My Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-all",
                    solid
                      ? "border-slate-200 text-[#0B1F3A] hover:border-[#1E5FBE] hover:text-[#1E5FBE]"
                      : "border-white/30 text-white hover:bg-white/10",
                  )}
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
                <Link href="/keyneet" className="btn-primary text-sm py-2 px-5">
                  Book a Stay
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-xl",
              solid
                ? "text-[#0B1F3A] hover:bg-slate-100"
                : "text-white hover:bg-white/10",
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-slate-100",
          menuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="px-4 py-4 flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl text-[#0B1F3A] hover:bg-slate-50"
          >
            <Home size={16} />
            Home
          </Link>

          {/* Keyneet accordion — hidden on investments pages */}
          {!pathname.startsWith("/investments") &&
            !pathname.startsWith("/invest") && (
              <div>
                <button
                  onClick={() =>
                    setMobileSection(
                      mobileSection === "keyneet" ? null : "keyneet",
                    )
                  }
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl text-[#0B1F3A] hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <Building2 size={16} />
                    Keyneet
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform",
                      mobileSection === "keyneet" && "rotate-180",
                    )}
                  />
                </button>
                {mobileSection === "keyneet" && (
                  <div className="ml-4 pl-3 border-l-2 border-[#1E5FBE]/20 space-y-1 mt-1">
                    {KEYNEET_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="block px-3 py-2 text-sm text-slate-600 hover:text-[#1E5FBE] rounded-lg hover:bg-blue-50"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Investments accordion — hidden on keyneet/keyneet pages */}
          {!pathname.startsWith("/keyneet") && (
            <div>
              <button
                onClick={() =>
                  setMobileSection(mobileSection === "invest" ? null : "invest")
                }
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl text-[#0B1F3A] hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  Investments
                </span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform",
                    mobileSection === "invest" && "rotate-180",
                  )}
                />
              </button>
              {mobileSection === "invest" && (
                <div className="ml-4 pl-3 border-l-2 border-[#C9A84C]/30 space-y-1 mt-1">
                  {INVEST_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-3 py-2 text-sm text-slate-600 hover:text-[#1E5FBE] rounded-lg hover:bg-blue-50"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl text-[#0B1F3A] hover:bg-slate-50"
          >
            <Phone size={16} />
            Contact
          </Link>

          {/* Auth */}
          <div className="mt-2 pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-9 h-9 rounded-full bg-[#1E5FBE] flex items-center justify-center text-white text-sm font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F3A]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1E5FBE] font-medium rounded-xl hover:bg-blue-50"
                  >
                    <LayoutDashboard size={15} />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 rounded-xl hover:bg-slate-50"
                >
                  <User size={15} />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 rounded-xl hover:bg-red-50 w-full"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary w-full text-sm justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary  w-full text-sm justify-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
