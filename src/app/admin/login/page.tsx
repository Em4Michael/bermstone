'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FormData { email: string; password: string }

export default function AdminLoginPage() {
  const { login }  = useAuth();
  const router     = useRouter();
  const [showPw, setShowPw]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async ({ email, password }: FormData) => {
    setSubmitting(true); setError('');
    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1E5FBE] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">B</div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-blue-300 text-sm mt-1">Sign in to manage Bermstone</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" {...register('email', { required: true })} className="form-input" placeholder="admin@bermstone.com" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} {...register('password', { required: true })} className="form-input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
