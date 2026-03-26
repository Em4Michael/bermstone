'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff, UserPlus } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: 'guest' | 'owner' | 'investor';
}

export default function RegisterPage() {
  const { login }    = useAuth();
  const router       = useRouter();
  const [showPw,     setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { role: 'guest' },
  });

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        password:  data.password,
        role:      data.role,
      });
      // Auto-login after registration
      await login(data.email, data.password);
      router.replace('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20 pb-12 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1E5FBE] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">B</div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1F3A]">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Join Bermstone to book stays or explore investments</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name</label>
                <input {...register('firstName', { required: 'Required' })} className="form-input" placeholder="John" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input {...register('lastName', { required: 'Required' })} className="form-input" placeholder="Doe" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="form-input" placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="tel" {...register('phone')} className="form-input" placeholder="+234 800 000 0000" />
            </div>

            {/* Role */}
            <div>
              <label className="form-label">I am a…</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'guest',    label: '🏠 Guest',    desc: 'Looking to book' },
                  { value: 'owner',    label: '🏢 Owner',    desc: 'I have property' },
                  { value: 'investor', label: '📈 Investor', desc: 'Looking to invest' },
                ] as const).map(({ value, label, desc }) => {
                  const selected = watch('role') === value;
                  return (
                    <label key={value}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        selected ? 'border-[#1E5FBE] bg-[#EBF2FF]' : 'border-slate-200 hover:border-[#1E5FBE]/50'
                      }`}>
                      <input type="radio" value={value} {...register('role')} className="sr-only" />
                      <span className="text-lg mb-1">{label.split(' ')[0]}</span>
                      <span className={`text-xs font-medium ${selected ? 'text-[#1E5FBE]' : 'text-slate-600'}`}>
                        {label.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                  className="form-input pr-10"
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className="form-input"
                placeholder="Repeat password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full gap-2">
              {submitting
                ? <><Loader2 size={16} className="animate-spin" />Creating account…</>
                : <><UserPlus size={16} />Create Account</>
              }
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1E5FBE] font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
