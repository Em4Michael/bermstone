'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login }    = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') || '/';

  const [showPw,     setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async ({ email, password }: FormData) => {
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      // Redirect admins to admin panel, others to intended page
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bermstone_token')}` },
      });
      const data = await res.json();
      if (data.user?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace(redirectTo === '/login' ? '/' : redirectTo);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1E5FBE] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">B</div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1F3A]">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your Bermstone account</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="form-input"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#1E5FBE] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full gap-2">
              {submitting
                ? <><Loader2 size={16} className="animate-spin" />Signing in…</>
                : <><LogIn size={16} />Sign In</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#1E5FBE] font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Admin hint */}
        <div className="mt-4 p-4 bg-[#EBF2FF] rounded-xl text-center">
          <p className="text-xs text-slate-500">
            Admin access? Log in with your admin credentials and you&apos;ll be redirected automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
