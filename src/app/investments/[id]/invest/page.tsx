'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, CheckCircle, TrendingUp, Shield, FileText } from 'lucide-react';
import { investmentsApi, inquiriesApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Investment } from '@/types';
import { formatCurrency, STATUS_LABELS, PROJECT_TYPE_LABELS } from '@/lib/utils';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  investmentAmount: number;
  timeline: string;
  message: string;
  agreeTerms: boolean;
}

export default function InvestPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : pathname;
  const router   = useRouter();

  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      firstName:        user?.firstName || '',
      lastName:         user?.lastName  || '',
      email:            user?.email     || '',
      phone:            user?.phone     || '',
      timeline:         '1-3months',
    },
  });

  useEffect(() => {
    investmentsApi.getOne(params.id)
      .then((res) => setInvestment(res.data))
      .catch(() => router.replace('/investments'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const onSubmit = async (data: FormData) => {
    if (!data.agreeTerms) { setError('You must agree to the investment terms to proceed.'); return; }
    setSaving(true); setError('');
    try {
      await inquiriesApi.submit({
        type:      'investor',
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        company:   data.company,
        message:   data.message,
        investmentDetails: {
          investmentAmount:  Number(data.investmentAmount),
          projectOfInterest: investment?.name,
          timeline:          data.timeline,
        },
      });
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show spinner while investment is loading (login is optional — not required)
  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#1E5FBE] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (done) return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-3">
          Investment Inquiry Submitted!
        </h1>
        <p className="text-slate-500 leading-relaxed mb-2">
          Thank you for your interest in <strong>{investment?.name}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Our investment team will review your inquiry and contact you within <strong>24 hours</strong> to discuss next steps, documentation, and the formal investment process.
        </p>
        <div className="bg-[#EBF2FF] rounded-2xl p-5 mb-8 text-left">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">What happens next</p>
          <div className="space-y-2">
            {[
              'Our team calls to discuss your investment goals',
              'You receive the full investment prospectus',
              'Legal documentation and agreement signing',
              'Fund transfer and investment confirmation',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#1E5FBE] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/investments/${params.id}`} className="btn-secondary">Back to Project</Link>
          <Link href="/investments" className="btn-primary">Browse More Projects</Link>
        </div>
      </div>
    </div>
  );

  if (!investment) return null;

  const pct = investment.totalAmount > 0
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      {/* Header */}
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/investments/${params.id}`}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} />Back to project
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-white">{investment.name}</h1>
              <p className="text-blue-200 text-sm">{PROJECT_TYPE_LABELS[investment.projectType]} · {investment.location.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Summary ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Key stats */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-[#0B1F3A] text-sm uppercase tracking-wider">Investment Summary</h3>
              {[
                { label: 'Expected ROI',    value: `${investment.expectedROI}%` },
                { label: 'Min. Investment', value: formatCurrency(investment.minimumInvestment, investment.currency) },
                { label: 'Project Status',  value: STATUS_LABELS[investment.status] },
                { label: 'Duration',        value: investment.projectPeriod?.durationMonths ? `${investment.projectPeriod.durationMonths} months` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-[#0B1F3A]">{value}</span>
                </div>
              ))}
            </div>

            {/* Funding bar */}
            <div className="card p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-[#0B1F3A]">Funding Progress</span>
                <span className="text-[#1E5FBE] font-semibold">{pct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{formatCurrency(investment.currentlyRaised, investment.currency)} raised</span>
                <span>of {formatCurrency(investment.totalAmount, investment.currency)}</span>
              </div>
            </div>

            {/* Documents */}
            {(investment.businessPlan || investment.buildingPlan) && (
              <div className="card p-5">
                <h3 className="font-semibold text-[#0B1F3A] text-sm uppercase tracking-wider mb-3">Project Documents</h3>
                <div className="space-y-2">
                  {investment.businessPlan && (
                    <a href={investment.businessPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1E5FBE] hover:underline">
                      <FileText size={15} />Download Business Plan
                    </a>
                  )}
                  {investment.buildingPlan && (
                    <a href={investment.buildingPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1E5FBE] hover:underline">
                      <FileText size={15} />Download Building Plan
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Trust badge */}
            <div className="bg-[#F3F7FF] rounded-xl p-4 flex items-start gap-3">
              <Shield size={18} className="text-[#1E5FBE] mt-0.5 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Your inquiry is handled securely. No payment is taken at this stage — our team will guide you through the full investment process.
              </p>
            </div>
          </div>

          {/* ── Right: Form ───────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="card p-6 sm:p-8">
              {/* Login / Register notice for guests */}
              {!authLoading && !user && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-blue-100">
                  <div className="bg-[#1E5FBE] px-5 py-3">
                    <p className="text-white font-semibold text-sm">Sign in to invest faster</p>
                    <p className="text-white/70 text-xs mt-0.5">Your details will be pre-filled and you can track your investment progress.</p>
                  </div>
                  <div className="bg-[#EBF2FF] px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <p className="text-slate-500 text-xs">After signing in you will be brought back here automatically.</p>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/login?redirect=${encodeURIComponent(pathname)}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#1E5FBE] text-white text-sm font-semibold rounded-xl hover:bg-[#1a52a8] transition-colors whitespace-nowrap shadow-sm">
                        Log In
                      </Link>
                      <Link
                        href={`/register?redirect=${encodeURIComponent(pathname)}`}
                        className="flex items-center gap-1.5 px-4 py-2 border border-[#1E5FBE] text-[#1E5FBE] text-sm font-semibold rounded-xl hover:bg-[#D1E4FF] transition-colors whitespace-nowrap">
                        Create Account
                      </Link>
                    </div>
                  </div>
                  <div className="bg-white px-5 py-2 border-t border-blue-100">
                    <p className="text-slate-400 text-xs">Or fill in the form below as a guest — no account required.</p>
                  </div>
                </div>
              )}

              <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-1">Express Your Interest</h2>
              <p className="text-slate-500 text-sm mb-6">
                Complete the form below and our investment team will contact you within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Contact details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input {...register('firstName', { required: 'Required' })} className="form-input" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input {...register('lastName', { required: 'Required' })} className="form-input" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" {...register('email', { required: 'Required' })} className="form-input" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" {...register('phone', { required: 'Required' })} className="form-input" placeholder="+212 600 000 000" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="form-label">Company / Organisation <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input {...register('company')} className="form-input" placeholder="e.g. Acme Capital Ltd" />
                </div>

                {/* Investment details */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Investment Details</p>

                  <div>
                    <label className="form-label">
                      Intended Investment Amount (MAD ) *
                      <span className="text-slate-400 font-normal ml-1">
                        — min {formatCurrency(investment.minimumInvestment, investment.currency)}
                      </span>
                    </label>
                    <input
                      type="number"
                      min={investment.minimumInvestment}
                      {...register('investmentAmount', {
                        required: 'Please enter an amount',
                        min: { value: investment.minimumInvestment, message: `Minimum is ${formatCurrency(investment.minimumInvestment, investment.currency)}` },
                        valueAsNumber: true,
                      })}
                      className="form-input"
                      placeholder={String(investment.minimumInvestment)}
                    />
                    {errors.investmentAmount && <p className="text-red-500 text-xs mt-1">{errors.investmentAmount.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">Investment Timeline *</label>
                  <select {...register('timeline', { required: true })} className="form-input">
                    <option value="immediate">Immediately — I&apos;m ready to proceed</option>
                    <option value="1-3months">Within 1–3 months</option>
                    <option value="3-6months">Within 3–6 months</option>
                    <option value="6+months">6+ months</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Message / Questions *</label>
                  <textarea
                    {...register('message', { required: 'Please add a message or question', minLength: { value: 10, message: 'At least 10 characters' } })}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Tell us about your investment goals, any questions about the project, or anything you'd like us to know…"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Terms checkbox */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('agreeTerms')}
                      className="mt-0.5 rounded border-slate-300 text-[#1E5FBE] shrink-0"
                    />
                    <span className="text-xs text-slate-500 leading-relaxed">
                      I understand this is an expression of interest only. No funds will be transferred at this stage.
                      I agree to be contacted by Bermstone&apos;s investment team and confirm I have read the{' '}
                      <Link href="/terms" className="text-[#1E5FBE] hover:underline">Terms & Conditions</Link>.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg">{error}</div>
                )}

                <button type="submit" disabled={saving} className="btn-gold w-full text-base py-3.5">
                  {saving
                    ? <><Loader2 size={18} className="animate-spin" />Submitting…</>
                    : <><TrendingUp size={18} />Submit Investment Inquiry</>
                  }
                </button>

                <p className="text-center text-xs text-slate-400">
                  No commitment or payment required at this stage.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
