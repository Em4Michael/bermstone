"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Shield,
  CalendarCheck,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/profile");
  }, [user, loading, router]);

  if (loading || !user)
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1E5FBE] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const ROLE_INFO = {
    guest: {
      label: "Guest",
      color: "bg-blue-100 text-blue-700",
      icon: "🏠",
      desc: "Browse and book premium shortlet apartments.",
    },
    owner: {
      label: "Property Owner",
      color: "bg-green-100 text-green-700",
      icon: "🏢",
      desc: "List and manage your keyneet with Bermstone.",
    },
    investor: {
      label: "Investor",
      color: "bg-yellow-100 text-yellow-700",
      icon: "📈",
      desc: "Access and invest in high-yield real estate projects.",
    },
    admin: {
      label: "Administrator",
      color: "bg-red-100 text-red-700",
      icon: "⚙️",
      desc: "Full administrative access to the platform.",
    },
  };

  const roleInfo = ROLE_INFO[user.role] || ROLE_INFO.guest;

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      {/* Header */}
      <div className="bg-[#0B1F3A] pt-14 pb-20 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#1E5FBE] flex items-center justify-center text-white text-3xl font-bold shrink-0">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-blue-200 text-sm mt-1">{user.email}</p>
            <span className={`badge mt-2 ${roleInfo.color}`}>
              {roleInfo.icon} {roleInfo.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 pb-16 space-y-6">
        {/* Account Details */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-5">
            Account Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-b border-slate-100">
              <User size={18} className="text-[#3B9EE0] shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-sm font-medium text-[#0B1F3A]">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-b border-slate-100">
              <Mail size={18} className="text-[#3B9EE0] shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-[#0B1F3A]">
                  {user.email}
                </p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 py-3 border-b border-slate-100">
                <Phone size={18} className="text-[#3B9EE0] shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-[#0B1F3A]">
                    {user.phone}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 py-3">
              <Shield size={18} className="text-[#3B9EE0] shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  Account Role
                </p>
                <p className="text-sm font-medium text-[#0B1F3A]">
                  {roleInfo.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{roleInfo.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions based on role */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-5">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/keyneet"
              className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:border-[#1E5FBE] hover:bg-blue-50 transition-all group"
            >
              <CalendarCheck
                size={20}
                className="text-[#3B9EE0] group-hover:text-[#1E5FBE]"
              />
              <div>
                <p className="text-sm font-medium text-[#0B1F3A]">
                  Browse Shortlets
                </p>
                <p className="text-xs text-slate-400">Find your next stay</p>
              </div>
            </Link>

            {(user.role === "investor" || user.role === "admin") && (
              <Link
                href="/investments"
                className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:border-[#C9A84C] hover:bg-yellow-50 transition-all group"
              >
                <TrendingUp size={20} className="text-[#C9A84C]" />
                <div>
                  <p className="text-sm font-medium text-[#0B1F3A]">
                    View Investments
                  </p>
                  <p className="text-xs text-slate-400">Explore projects</p>
                </div>
              </Link>
            )}

            {user.role === "owner" && (
              <Link
                href="/owner-support"
                className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:border-[#1E5FBE] hover:bg-blue-50 transition-all group"
              >
                <Shield
                  size={20}
                  className="text-[#3B9EE0] group-hover:text-[#1E5FBE]"
                />
                <div>
                  <p className="text-sm font-medium text-[#0B1F3A]">
                    Owner Support
                  </p>
                  <p className="text-xs text-slate-400">Manage your listings</p>
                </div>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 p-4 border border-red-100 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <Shield size={20} className="text-red-400" />
                <div>
                  <p className="text-sm font-medium text-[#0B1F3A]">
                    Admin Dashboard
                  </p>
                  <p className="text-xs text-slate-400">Manage the platform</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
