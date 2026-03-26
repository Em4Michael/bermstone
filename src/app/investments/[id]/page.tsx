'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, FileText, ExternalLink, ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { investmentsApi, inquiriesApi } from '@/lib/api';
import type { Investment } from '@/types';
import { formatCurrency, formatDate, PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, cn } from '@/lib/utils';
import InvestmentCard from '@/components/investments/InvestmentCard';

interface InquiryForm {
  firstName: string; lastName: string; email: string; phone: string;
  company?: string; investmentAmount?: number; timeline?: string; message: string;
}

function InvestorForm({ projectName }: { projectName: string }) {
  const [done,   setDone]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const { register, handleSubmit } = useForm<InquiryForm>();

  const onSubmit = async (data: InquiryForm) => {
    setSaving(true);
    try {
      await inquiriesApi.submit({
        type: 'investor', ...data,
        investmentDetails: { investmentAmount: data.investmentAmount, projectOfInterest: projectName, timeline: data.timeline },
      });
      setDone(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setSaving(false); }
  };

  if (done) return (
    <div className="card p-6 text-center">
      <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
      <h4 className="font-semibold text-[#0B1F3A] mb-1">Inquiry Received!</h4>
      <p className="text-slate-500 text-sm">Our investment team will contact you within 24 hours.</p>
    </div>
  );

  return (
    <div className="card p-6">
      <h4 className="font-display text-lg font-semibold text-[#0B1F3A] mb-4">Investment Inquiry</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="First name" {...register('firstName', { required: true })} className="form-input text-sm" />
          <input placeholder="Last name"  {...register('lastName',  { required: true })} className="form-input text-sm" />
        </div>
        <input type="email" placeholder="Email" {...register('email', { required: true })} className="form-input text-sm" />
        <input type="tel"   placeholder="Phone" {...register('phone', { required: true })} className="form-input text-sm" />
        <input placeholder="Company (optional)" {...register('company')} className="form-input text-sm" />
        <input type="number" placeholder="Investment Amount (₦)" {...register('investmentAmount')} className="form-input text-sm" />
        <select {...register('timeline')} className="form-input text-sm">
          <option value="">Investment timeline</option>
          <option value="immediate">Immediately</option>
          <option value="1-3months">1–3 months</option>
          <option value="3-6months">3–6 months</option>
          <option value="6+months">6+ months</option>
        </select>
        <textarea placeholder="Questions or comments..." {...register('message', { required: true })} rows={3} className="form-input text-sm resize-none" />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
          {saving ? <><Loader2 size={15} className="animate-spin" />Submitting...</> : 'Submit Inquiry'}
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
      .then((res) => setInvestment(res.data))
      .catch(() => setInvestment(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen pt-20 bg-[#FAFBFF]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="skeleton h-[420px] rounded-2xl mb-6" />
        <div className="skeleton h-8 w-1/2 mb-4" />
        <div className="skeleton h-4 w-full" />
      </div>
    </div>
  );
  if (!investment) return notFound();

  const pct  = investment.totalAmount > 0 ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;
  const imgs = investment.images?.length > 0 ? investment.images : [{ url: investment.coverImage || '' }];

  return (
    <div className="min-h-screen pt-20 bg-[#FAFBFF]">
      <div className="relative bg-[#0B1F3A]">
        <div className="relative aspect-[16/7] max-h-[500px] overflow-hidden">
          <Image src={imgs[imgIdx]?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200'}
            alt={investment.name} fill priority className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-[#0B1F3A]/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <span className={cn('badge mb-3', STATUS_COLORS[investment.status] || 'bg-slate-100 text-slate-700')}>{STATUS_LABELS[investment.status]}</span>
            <h1 className="font-display text-4xl font-semibold mb-1">{investment.name}</h1>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin size={14} />{investment.location.city}, {investment.location.state}
              <span className="opacity-40">·</span>{PROJECT_TYPE_LABELS[investment.projectType]}
            </div>
          </div>
          {imgs.length > 1 && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><ChevronLeft size={18} /></button>
              <button onClick={() => setImgIdx((i) => (i + 1) % imgs.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><ChevronRight size={18} /></button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-3">Project Overview</h2>
              <p className="text-slate-600 leading-relaxed">{investment.description || investment.summary}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Expected ROI',   value: `${investment.expectedROI}%` },
                { label: 'Duration',        value: `${investment.projectPeriod?.durationMonths || '—'} months` },
                { label: 'Min. Investment', value: formatCurrency(investment.minimumInvestment, investment.currency) },
                { label: 'Total Target',    value: formatCurrency(investment.totalAmount, investment.currency) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-blue-50 rounded-xl p-4 text-center shadow-card">
                  <div className="font-display font-bold text-xl text-[#0B1F3A] mb-0.5">{value}</div>
                  <div className="text-slate-400 text-xs">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-blue-50 rounded-2xl p-6 shadow-card">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-[#0B1F3A]">Funding Progress</span>
                <span className="text-[#1E5FBE] font-semibold">{pct}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{formatCurrency(investment.currentlyRaised, investment.currency)} raised</span>
                <span>{formatCurrency(investment.totalAmount - investment.currentlyRaised, investment.currency)} remaining</span>
              </div>
            </div>

            {investment.projectPeriod?.startDate && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Timeline</h2>
                <div className="flex gap-6 text-sm text-slate-600">
                  <div><div className="text-slate-400 text-xs mb-0.5">Start</div>{formatDate(investment.projectPeriod.startDate)}</div>
                  <div><div className="text-slate-400 text-xs mb-0.5">End</div>{formatDate(investment.projectPeriod.endDate)}</div>
                  <div><div className="text-slate-400 text-xs mb-0.5">Duration</div>{investment.projectPeriod.durationMonths} months</div>
                </div>
              </div>
            )}

            {(investment.businessPlan || investment.buildingPlan) && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Project Documents</h2>
                <div className="flex flex-wrap gap-3">
                  {investment.businessPlan && (
                    <a href={investment.businessPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-[#EBF2FF] border border-blue-100 rounded-xl text-sm text-[#1E5FBE] hover:bg-[#D1E4FF]">
                      <FileText size={16} />Business Plan<ExternalLink size={12} />
                    </a>
                  )}
                  {investment.buildingPlan && (
                    <a href={investment.buildingPlan} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-[#EBF2FF] border border-blue-100 rounded-xl text-sm text-[#1E5FBE] hover:bg-[#D1E4FF]">
                      <FileText size={16} />Building Plan<ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {investment.similarProjects?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-5">Similar Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {investment.similarProjects.slice(0, 2).map((p) => <InvestmentCard key={p._id} investment={p} />)}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="card p-6">
                <div className="text-center mb-5">
                  <div className="font-display text-4xl font-bold text-[#1E5FBE] mb-1">{investment.expectedROI}%</div>
                  <div className="text-slate-500 text-sm">Expected Return on Investment</div>
                </div>
                <div className="text-sm text-slate-600 space-y-3 mb-6">
                  <div className="flex justify-between"><span>Min. Investment</span><span className="font-semibold text-[#0B1F3A]">{formatCurrency(investment.minimumInvestment, investment.currency)}</span></div>
                  <div className="flex justify-between"><span>Project Type</span><span className="font-semibold text-[#0B1F3A]">{PROJECT_TYPE_LABELS[investment.projectType]}</span></div>
                  <div className="flex justify-between"><span>Status</span><span className={cn('badge text-xs', STATUS_COLORS[investment.status])}>{STATUS_LABELS[investment.status]}</span></div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary w-full">Express Interest</button>
                <p className="text-center text-xs text-slate-400 mt-3">No commitment required.</p>
              </div>
              {showForm && <InvestorForm projectName={investment.name} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
