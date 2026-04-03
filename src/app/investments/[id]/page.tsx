'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, FileText, ExternalLink, ChevronLeft, ChevronRight,
  TrendingUp, Shield, Clock, Users, Loader2, CheckCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { investmentsApi, inquiriesApi } from '@/lib/api';
import type { Investment } from '@/types';
import { formatCurrency, formatDate, PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, cn } from '@/lib/utils';
import InvestmentCard from '@/components/investments/InvestmentCard';

interface InquiryForm {
  firstName: string; lastName: string; email: string; phone: string;
  company?: string; investmentAmount?: number; timeline: string; message: string;
}

function AnimatedProgressBar({ pct }: { pct: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setW(pct); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="h-3 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] transition-all duration-1500 ease-out"
        style={{ width: `${w}%`, transitionDuration: '1.5s' }} />
    </div>
  );
}

function InvestorForm({ investment }: { investment: Investment }) {
  const [done,   setDone]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<InquiryForm>({
    defaultValues: { timeline: '1-3months' },
  });

  const onSubmit = async (data: InquiryForm) => {
    setSaving(true);
    try {
      await inquiriesApi.submit({
        type: 'investor', ...data,
        investmentDetails: {
          investmentAmount:  Number(data.investmentAmount),
          projectOfInterest: investment.name,
          timeline:          data.timeline,
        },
      });
      setDone(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setSaving(false); }
  };

  if (done) return (
    <div className="card p-8 text-center animate-scale-in">
      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
      <h4 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Inquiry Received!</h4>
      <p className="text-slate-500 text-sm">Our investment team will contact you within 24 hours.</p>
    </div>
  );

  return (
    <div className="card p-6 animate-fade-up">
      <h4 className="font-display text-xl font-semibold text-[#0B1F3A] mb-1">Express Interest</h4>
      <p className="text-slate-400 text-sm mb-5">No commitment at this stage.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input placeholder="First name" {...register('firstName', { required: true })} className="form-input text-sm" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">Required</p>}
          </div>
          <div>
            <input placeholder="Last name" {...register('lastName', { required: true })} className="form-input text-sm" />
          </div>
        </div>
        <input type="email" placeholder="Email *" {...register('email', { required: true })} className="form-input text-sm" />
        <input type="tel"   placeholder="Phone *" {...register('phone', { required: true })} className="form-input text-sm" />
        <input placeholder="Company (optional)" {...register('company')} className="form-input text-sm" />
        <div>
          <input type="number" placeholder={`Amount (min ${formatCurrency(investment.minimumInvestment, investment.currency)})`}
            min={investment.minimumInvestment}
            {...register('investmentAmount', { min: investment.minimumInvestment })}
            className="form-input text-sm" />
          {errors.investmentAmount && <p className="text-red-500 text-xs mt-1">Min {formatCurrency(investment.minimumInvestment, investment.currency)}</p>}
        </div>
        <select {...register('timeline')} className="form-input text-sm">
          <option value="immediate">Ready to invest now</option>
          <option value="1-3months">Within 1–3 months</option>
          <option value="3-6months">Within 3–6 months</option>
          <option value="6+months">6+ months</option>
        </select>
        <textarea placeholder="Message / questions…" {...register('message', { required: true, minLength: 5 })}
          rows={3} className="form-input text-sm resize-none" />
        {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
        <button type="submit" disabled={saving} className="btn-gold w-full">
          {saving ? <><Loader2 size={15} className="animate-spin" />Submitting…</> : <><TrendingUp size={15} />Submit Inquiry</>}
        </button>
      </form>
    </div>
  );
}

export default function InvestmentDetailPage({ params }: { params: { id: string } }) {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [showForm,   setShowForm]   = useState(false);

  useEffect(() => {
    investmentsApi.getOne(params.id)
      .then(res => setInvestment(res.data))
      .catch(() => setInvestment(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="shimmer h-[55vh] w-full" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="shimmer h-10 w-2/3 rounded-xl" />
          <div className="shimmer h-40 rounded-xl" />
        </div>
        <div className="shimmer h-80 rounded-2xl" />
      </div>
    </div>
  );
  if (!investment) return notFound();

  const pct  = investment.totalAmount > 0
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;
  const imgs = investment.images?.length > 0 ? investment.images : [{ url: investment.coverImage || '' }];

  return (
    <div className="min-h-screen bg-[#FAFBFF]">

      {/* ── Cinematic Hero Image ─────────────────────── */}
      <div className="relative bg-[#071528] pt-20">
        <div className="relative overflow-hidden" style={{ height: 'clamp(300px, 55vw, 540px)' }}>
          <Image src={imgs[imgIdx]?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400'}
            alt={investment.name} fill priority className="object-cover opacity-85 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071528]/90 via-[#071528]/30 to-transparent" />

          {/* Badge */}
          <div className="absolute top-6 left-6">
            <span className={cn('badge shadow-lg', STATUS_COLORS[investment.status] || 'bg-slate-100 text-slate-700')}>
              {STATUS_LABELS[investment.status]}
            </span>
          </div>

          {/* Nav */}
          {imgs.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 animate-fade-up">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <MapPin size={14} />{investment.location.city}, {investment.location.state}
              <span className="opacity-40">·</span>
              {PROJECT_TYPE_LABELS[investment.projectType]}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">{investment.name}</h1>
          </div>
        </div>

        {/* Thumbnail strip */}
        {imgs.length > 1 && (
          <div className="flex gap-2 px-4 py-2 bg-[#040e1e] overflow-x-auto">
            {imgs.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden transition-all ${i === imgIdx ? 'ring-2 ring-[#C9A84C] scale-105' : 'opacity-50 hover:opacity-80'}`}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left */}
          <div className="lg:col-span-2 space-y-12">

            {/* Key metrics */}
            <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp size={20} className="text-[#C9A84C]" />, bg: 'bg-yellow-50', label: 'Expected ROI', val: `${investment.expectedROI}%` },
                { icon: <Users size={20} className="text-[#1E5FBE]" />,       bg: 'bg-blue-50',   label: 'Min. Investment', val: formatCurrency(investment.minimumInvestment, investment.currency) },
                { icon: <Clock size={20} className="text-violet-500" />,       bg: 'bg-violet-50', label: 'Duration',    val: investment.projectPeriod?.durationMonths ? `${investment.projectPeriod.durationMonths}mo` : '—' },
                { icon: <Shield size={20} className="text-green-500" />,       bg: 'bg-green-50',  label: 'Structure',   val: 'Legally Sound' },
              ].map(({ icon, bg, label, val }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 border border-white hover:shadow-md transition-shadow`}>
                  <div className="mb-2">{icon}</div>
                  <div className="text-slate-400 text-xs">{label}</div>
                  <div className="font-display font-bold text-[#0B1F3A] text-lg leading-tight">{val}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="reveal">
              <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-4">Project Overview</h2>
              <p className="text-slate-600 leading-relaxed">{investment.description || investment.summary}</p>
            </div>

            {/* Animated funding bar */}
            <div className="reveal bg-white rounded-2xl p-7 shadow-card border border-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#0B1F3A]">Funding Progress</h3>
                  <p className="text-slate-400 text-sm">{formatCurrency(investment.currentlyRaised, investment.currency)} raised of {formatCurrency(investment.totalAmount, investment.currency)}</p>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-3xl text-[#1E5FBE]">{pct}%</div>
                  <div className="text-slate-400 text-xs">funded</div>
                </div>
              </div>
              <AnimatedProgressBar pct={pct} />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0</span>
                <span>{formatCurrency(investment.totalAmount - investment.currentlyRaised, investment.currency)} remaining</span>
              </div>
            </div>

            {/* Timeline */}
            {investment.projectPeriod?.startDate && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-5">Project Timeline</h2>
                <div className="flex items-center gap-0 reveal-stagger">
                  <div className="flex-1 bg-white rounded-l-2xl border border-blue-50 p-5 shadow-sm">
                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Start Date</div>
                    <div className="font-semibold text-[#0B1F3A]">{formatDate(investment.projectPeriod.startDate)}</div>
                  </div>
                  <div className="bg-[#1E5FBE] text-white px-4 py-5 text-center text-sm font-medium z-10 shadow-lg">
                    <div className="font-display font-bold text-2xl">{investment.projectPeriod.durationMonths}</div>
                    <div className="text-blue-200 text-xs">months</div>
                  </div>
                  <div className="flex-1 bg-white rounded-r-2xl border border-blue-50 p-5 shadow-sm text-right">
                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">End Date</div>
                    <div className="font-semibold text-[#0B1F3A]">{formatDate(investment.projectPeriod.endDate)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {(investment.businessPlan || investment.buildingPlan) && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-4">Project Documents</h2>
                <div className="flex flex-wrap gap-3">
                  {investment.businessPlan && (
                    <a href={investment.businessPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-[#EBF2FF] border border-blue-100 rounded-2xl text-sm text-[#1E5FBE] hover:bg-[#D1E4FF] transition-all hover:shadow-md font-medium">
                      <FileText size={16} />Business Plan<ExternalLink size={12} />
                    </a>
                  )}
                  {investment.buildingPlan && (
                    <a href={investment.buildingPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-[#EBF2FF] border border-blue-100 rounded-2xl text-sm text-[#1E5FBE] hover:bg-[#D1E4FF] transition-all hover:shadow-md font-medium">
                      <FileText size={16} />Building Plan<ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Similar projects */}
            {investment.similarProjects?.length > 0 && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-6">Similar Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-stagger">
                  {investment.similarProjects.slice(0, 2).map(p => <InvestmentCard key={p._id} investment={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">

              {/* ROI card */}
              <div className="card p-7 text-center animate-fade-left" style={{ animationDelay: '100ms' }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E5FBE] to-[#3B9EE0] flex items-center justify-center mx-auto mb-4 glow-blue animate-float-slow">
                  <div>
                    <div className="font-display font-bold text-3xl text-white leading-none">{investment.expectedROI}%</div>
                    <div className="text-blue-100 text-xs">ROI</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 space-y-3 mb-6 text-left">
                  {[
                    ['Min. Investment', formatCurrency(investment.minimumInvestment, investment.currency)],
                    ['Project Type',    PROJECT_TYPE_LABELS[investment.projectType]],
                    ['Status',         STATUS_LABELS[investment.status]],
                    ...(investment.projectPeriod?.durationMonths ? [['Duration', `${investment.projectPeriod.durationMonths} months`]] : []),
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-semibold text-[#0B1F3A] text-sm">{val}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/investments/${params.id}/invest`} className="btn-gold w-full mb-2 justify-center">
                  🏦 Invest Now
                </Link>
                <button onClick={() => setShowForm(!showForm)}
                  className="btn-secondary w-full text-sm justify-center">
                  {showForm ? 'Close Quick Inquiry' : 'Quick Inquiry'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">No payment or commitment at this stage.</p>
              </div>

              {/* Trust badges */}
              <div className="bg-[#F8FAFF] rounded-2xl p-5 border border-blue-50 animate-fade-left" style={{ animationDelay: '200ms' }}>
                <div className="space-y-3">
                  {[
                    { icon: <Shield size={16} className="text-green-500" />, text: 'Legally structured investment' },
                    { icon: <FileText size={16} className="text-[#1E5FBE]" />, text: 'Full documentation provided' },
                    { icon: <TrendingUp size={16} className="text-[#C9A84C]" />, text: 'Transparent ROI projections' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                      {icon}<span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {showForm && <InvestorForm investment={investment} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
