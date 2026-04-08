'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, FileText, ExternalLink, ChevronLeft, ChevronRight,
  TrendingUp, Shield, Clock, Users, Loader2, CheckCircle,
  X, Phone, Mail, ArrowRight, Star,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { investmentsApi, inquiriesApi } from '@/lib/api';
import type { Investment } from '@/types';
import { formatCurrency, formatDate, PROJECT_TYPE_LABELS, STATUS_LABELS, cn } from '@/lib/utils';
import InvestmentCard from '@/components/investments/InvestmentCard';
import ContactModal from '@/components/shared/ContactModal';

const STATUS_STYLES: Record<string, string> = {
  upcoming:  'bg-blue-50   text-[#1E5FBE]  border-blue-100',
  active:    'bg-green-50  text-green-700  border-green-100',
  funded:    'bg-yellow-50 text-[#C9A84C]  border-yellow-100',
  completed: 'bg-slate-50  text-slate-600  border-slate-200',
};

function AnimatedBar({ pct }: { pct: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setW(pct); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);
  return (
    <div ref={ref} className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] transition-all ease-out"
        style={{ width: `${w}%`, transitionDuration: '1.6s' }} />
    </div>
  );
}

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  company?: string; investmentAmount: number; timeline: string; message: string;
}

function InquiryForm({ investment }: { investment: Investment }) {
  const [done, setDone]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { timeline: '1-3months', investmentAmount: investment.minimumInvestment },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError('');
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
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setSaving(false); }
  };

  if (done) return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle size={32} className="text-green-500" />
      </div>
      <h4 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Inquiry Received</h4>
      <p className="text-slate-500 text-sm">Our investment team will contact you within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input placeholder="First name *" {...register('firstName', { required: true })} className="form-input text-sm" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">Required</p>}
        </div>
        <input placeholder="Last name *" {...register('lastName', { required: true })} className="form-input text-sm" />
      </div>
      <input type="email" placeholder="Email address *" {...register('email', { required: true })} className="form-input text-sm" />
      <input type="tel"   placeholder="Phone / WhatsApp *" {...register('phone', { required: true })} className="form-input text-sm" />
      <input placeholder="Company (optional)" {...register('company')} className="form-input text-sm" />
      <div>
        <input type="number" placeholder={`Investment amount (min ${formatCurrency(investment.minimumInvestment, investment.currency)})`}
          min={investment.minimumInvestment}
          {...register('investmentAmount', { required: true, min: investment.minimumInvestment, valueAsNumber: true })}
          className="form-input text-sm" />
        {errors.investmentAmount && <p className="text-red-500 text-xs mt-1">Minimum {formatCurrency(investment.minimumInvestment, investment.currency)}</p>}
      </div>
      <select {...register('timeline')} className="form-input text-sm">
        <option value="immediate">Ready to invest immediately</option>
        <option value="1-3months">Within 1–3 months</option>
        <option value="3-6months">Within 3–6 months</option>
        <option value="6+months">6+ months</option>
      </select>
      <textarea placeholder="Message or questions…" {...register('message', { required: true, minLength: 5 })}
        rows={3} className="form-input text-sm resize-none" />
      {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
      <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md">
        {saving ? <><Loader2 size={16} className="animate-spin" />Submitting…</> : <><TrendingUp size={16} />Submit Inquiry</>}
      </button>
      <p className="text-center text-xs text-slate-400">No commitment or payment at this stage.</p>
    </form>
  );
}

export default function InvestmentDetailPage({ params }: { params: { id: string } }) {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [imgIdx,     setImgIdx]     = useState(0);
  const [lightbox,   setLightbox]   = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    investmentsApi.getOne(params.id)
      .then(res => setInvestment(res.data))
      .catch(() => setInvestment(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="shimmer h-[55vh] rounded-2xl" />
        <div className="shimmer h-8 w-1/2 rounded-xl" />
        <div className="shimmer h-4 w-1/3 rounded-lg" />
      </div>
    </div>
  );
  if (!investment) return notFound();

  const pct  = investment.totalAmount > 0
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;
  const imgs = investment.images?.length > 0
    ? investment.images
    : [{ url: investment.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200' }];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky nav bar on scroll ──────────────────── */}
      <div className={cn(
        'fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 transition-all duration-300',
        scrolled ? 'translate-y-0 shadow-sm' : '-translate-y-full'
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-[#0B1F3A] text-lg leading-none">{investment.name}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <MapPin size={10} />{investment.location.city}
              <span>·</span>
              <TrendingUp size={10} className="text-[#C9A84C]" />
              <span className="text-[#C9A84C] font-semibold">{investment.expectedROI}% ROI</span>
            </div>
          </div>
          <Link href={`/investments/${params.id}/invest`} className="btn-gold text-sm py-2">
            Invest Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ── Hero image gallery ────────────────────────── */}
        <div className="relative mb-8">
          <div className="relative rounded-3xl overflow-hidden" style={{ height: 'clamp(300px, 55vw, 560px)' }}>
            <Image src={imgs[imgIdx]?.url} alt={investment.name} fill priority
              className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 via-transparent to-transparent" />

            {/* Status + type */}
            <div className="absolute top-5 left-5 flex gap-2">
              <span className={cn('text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm capitalize', STATUS_STYLES[investment.status] || '')}>
                {STATUS_LABELS[investment.status]}
              </span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20">
                {PROJECT_TYPE_LABELS[investment.projectType]}
              </span>
            </div>

            {/* Navigation */}
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110">
                  <ChevronLeft size={20} className="text-[#0B1F3A]" />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110">
                  <ChevronRight size={20} className="text-[#0B1F3A]" />
                </button>
              </>
            )}

            {/* Bottom overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-white/70 text-sm flex items-center gap-1.5 mb-1">
                    <MapPin size={13} />{investment.location.city}, {investment.location.country || 'Morocco'}
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                    {investment.name}
                  </h1>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="font-display text-4xl font-bold text-[#C9A84C]">{investment.expectedROI}%</div>
                  <div className="text-white/60 text-sm">Expected ROI</div>
                </div>
              </div>
            </div>

            {/* Dot nav */}
            {imgs.length > 1 && (
              <div className="absolute top-5 right-5 flex gap-1.5">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={cn('rounded-full transition-all', i === imgIdx ? 'bg-white w-5 h-2' : 'bg-white/40 w-2 h-2')} />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {imgs.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={cn('relative w-20 h-14 shrink-0 rounded-xl overflow-hidden transition-all',
                    i === imgIdx ? 'ring-2 ring-[#C9A84C] opacity-100' : 'opacity-50 hover:opacity-80')}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Content grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">

          {/* ── Left ──────────────────────────────────── */}
          <div className="space-y-14">

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp size={22} className="text-[#C9A84C]" />, bg: 'bg-yellow-50', label: 'Expected ROI',     val: `${investment.expectedROI}%` },
                { icon: <Users      size={22} className="text-[#1E5FBE]" />, bg: 'bg-blue-50',   label: 'Min. Investment',  val: formatCurrency(investment.minimumInvestment, investment.currency) },
                { icon: <Clock      size={22} className="text-violet-500"/>, bg: 'bg-violet-50', label: 'Duration',         val: investment.projectPeriod?.durationMonths ? `${investment.projectPeriod.durationMonths} months` : '—' },
                { icon: <Shield     size={22} className="text-green-500" />, bg: 'bg-green-50',  label: 'Structure',        val: 'Legal & Secure' },
              ].map(({ icon, bg, label, val }) => (
                <div key={label} className={cn('rounded-2xl p-5 border border-white/80', bg)}>
                  <div className="mb-3">{icon}</div>
                  <div className="text-slate-500 text-xs uppercase tracking-wide">{label}</div>
                  <div className="font-display font-bold text-[#0B1F3A] text-xl mt-0.5 leading-tight">{val}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Overview</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-5">Project Overview</h2>
              <p className="text-slate-600 leading-[1.85] text-[15px]">{investment.description || investment.summary}</p>
            </div>

            {/* Funding progress */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Funding</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="rounded-3xl border border-slate-100 p-7 bg-[#F8FAFF]">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-[#0B1F3A]">Funding Progress</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {formatCurrency(investment.currentlyRaised, investment.currency)} raised of {formatCurrency(investment.totalAmount, investment.currency)} target
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-4xl text-[#1E5FBE]">{pct}%</div>
                    <div className="text-slate-400 text-xs mt-0.5">funded</div>
                  </div>
                </div>
                <AnimatedBar pct={pct} />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>MAD 0</span>
                  <span className="text-[#1E5FBE] font-medium">
                    {formatCurrency(Math.max(investment.totalAmount - investment.currentlyRaised, 0), investment.currency)} remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {investment.projectPeriod?.startDate && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Timeline</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-6">Project Timeline</h2>
                <div className="flex items-stretch gap-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <div className="flex-1 bg-white p-6">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Start Date</div>
                    <div className="font-display text-xl font-semibold text-[#0B1F3A]">{formatDate(investment.projectPeriod.startDate)}</div>
                    <div className="text-slate-400 text-xs mt-1">Project begins</div>
                  </div>
                  <div className="bg-gradient-to-b from-[#1E5FBE] to-[#163669] text-white px-6 flex flex-col items-center justify-center text-center min-w-[100px]">
                    <div className="font-display font-bold text-3xl">{investment.projectPeriod.durationMonths}</div>
                    <div className="text-blue-200 text-xs font-medium mt-0.5">months</div>
                  </div>
                  <div className="flex-1 bg-white p-6 text-right">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">End Date</div>
                    <div className="font-display text-xl font-semibold text-[#0B1F3A]">{formatDate(investment.projectPeriod.endDate)}</div>
                    <div className="text-slate-400 text-xs mt-1">Returns distributed</div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {(investment.businessPlan || investment.buildingPlan) && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Documents</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-6">Project Documents</h2>
                <div className="flex flex-wrap gap-4">
                  {investment.businessPlan && (
                    <a href={investment.businessPlan} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-3 bg-[#F8FAFF] hover:bg-[#EBF2FF] border border-blue-100 rounded-2xl px-6 py-4 transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] group-hover:bg-[#1E5FBE] flex items-center justify-center text-[#1E5FBE] group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0B1F3A] text-sm">Business Plan</div>
                        <div className="text-slate-400 text-xs">Download PDF</div>
                      </div>
                      <ExternalLink size={14} className="text-slate-400 ml-2" />
                    </a>
                  )}
                  {investment.buildingPlan && (
                    <a href={investment.buildingPlan} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-3 bg-[#F8FAFF] hover:bg-[#EBF2FF] border border-blue-100 rounded-2xl px-6 py-4 transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] group-hover:bg-[#1E5FBE] flex items-center justify-center text-[#1E5FBE] group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0B1F3A] text-sm">Building Plan</div>
                        <div className="text-slate-400 text-xs">Download PDF</div>
                      </div>
                      <ExternalLink size={14} className="text-slate-400 ml-2" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Shield size={20} className="text-green-500" />, title: 'Legally Structured', desc: 'Formal investment documentation provided to all investors.' },
                { icon: <FileText size={20} className="text-[#1E5FBE]" />, title: 'Full Transparency', desc: 'Complete business and building plans available before commitment.' },
                { icon: <Star size={20} className="text-[#C9A84C]" />, title: 'Proven Returns', desc: 'Track record of delivering projected ROI to our investors.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="mb-3">{icon}</div>
                  <div className="font-semibold text-[#0B1F3A] text-sm mb-1">{title}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>

            {/* Similar projects */}
            {investment.similarProjects?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">More Projects</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {investment.similarProjects.slice(0, 2).map(p => (
                    <InvestmentCard key={p._id} investment={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────── */}
          <div>
            <div className="sticky top-28 space-y-4">

              {/* ROI card */}
              <div className="rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1E5FBE] p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
                  <div className="relative z-10">
                    <div className="font-display font-bold text-6xl text-[#C9A84C] leading-none">{investment.expectedROI}%</div>
                    <div className="text-white/70 text-sm mt-1">Expected Return on Investment</div>
                    <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-white/80 text-xs">
                      <TrendingUp size={12} />Min. {formatCurrency(investment.minimumInvestment, investment.currency)}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-white p-6 space-y-3">
                  {[
                    ['Project Type',    PROJECT_TYPE_LABELS[investment.projectType]],
                    ['Location',        `${investment.location.city}, Morocco`],
                    ['Status',          STATUS_LABELS[investment.status]],
                    ...(investment.projectPeriod?.durationMonths
                      ? [['Duration', `${investment.projectPeriod.durationMonths} months`]] : []),
                    ['Total Target',    formatCurrency(investment.totalAmount, investment.currency)],
                    ['Currently Raised', formatCurrency(investment.currentlyRaised, investment.currency)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-slate-400 text-sm">{label}</span>
                      <span className="font-semibold text-[#0B1F3A] text-sm">{val}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-white px-6 pb-6 space-y-3">
                  <Link href={`/investments/${params.id}/invest`}
                    className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] hover:bg-[#b8963e] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md text-sm">
                    <TrendingUp size={16} />Invest in This Project
                    <ArrowRight size={14} />
                  </Link>
                  <div className="flex gap-2">
                    <a href="https://wa.me/212600359326" target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:border-[#1E5FBE] text-slate-600 hover:text-[#1E5FBE] font-medium py-2.5 rounded-xl transition-all text-xs">
                      <Phone size={13} />WhatsApp
                    </a>
                    <button onClick={() => setContactOpen(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:border-[#1E5FBE] text-slate-600 hover:text-[#1E5FBE] font-medium py-2.5 rounded-xl transition-all text-xs">
                      <Mail size={13} />Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Inquiry form */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="font-display text-lg font-semibold text-[#0B1F3A] mb-1">Quick Inquiry</h4>
                <p className="text-slate-400 text-xs mb-5">Tell us about your interest — no commitment needed.</p>
                <InquiryForm investment={investment} />
              </div>

              <Link href="/investments"
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#1E5FBE] text-sm transition-colors py-2">
                <ChevronLeft size={14} />All investment projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        context={{ type: 'investment', name: investment.name }}
      />

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <X size={18} />
          </button>
          <div className="relative max-w-4xl w-full aspect-[16/9]" onClick={e => e.stopPropagation()}>
            <Image src={imgs[imgIdx]?.url} alt="" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}