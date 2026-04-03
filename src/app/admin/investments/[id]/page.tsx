'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Loader2, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { PROJECT_TYPE_LABELS, formatCurrency } from '@/lib/utils';

interface FormData {
  name: string; summary: string; description: string;
  address: string; city: string; state: string; country: string;
  totalAmount: number; minimumInvestment: number; currency: string;
  projectType: string; status: string;
  startDate: string; endDate: string; durationMonths: number;
  expectedROI: number;
  businessPlan: string; buildingPlan: string;
  images: { url: string }[];
  isFeatured: boolean; isActive: boolean;
}

export default function EditInvestmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState('');
  const [notFound,    setNotFound]    = useState(false);
  const [invName,     setInvName]     = useState('');
  const [currentlyRaised, setRaised] = useState(0);
  const [currency,    setCurrency]    = useState('NGN');

  const { register, handleSubmit, control, reset, watch } = useForm<FormData>({
    defaultValues: { country: 'Nigeria', currency: 'NGN', status: 'upcoming', isFeatured: false, isActive: true, images: [{ url: '' }] },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    api.get(`/investments/${params.id}`)
      .then((res) => {
        const inv = res.data.data;
        setInvName(inv.name);
        setRaised(inv.currentlyRaised || 0);
        setCurrency(inv.currency || 'NGN');
        reset({
          name:              inv.name              || '',
          summary:           inv.summary           || '',
          description:       inv.description       || '',
          address:           inv.location?.address || '',
          city:              inv.location?.city    || '',
          state:             inv.location?.state   || '',
          country:           inv.location?.country || 'Nigeria',
          totalAmount:       inv.totalAmount        || 0,
          minimumInvestment: inv.minimumInvestment  || 0,
          currency:          inv.currency           || 'NGN',
          projectType:       inv.projectType        || '',
          status:            inv.status             || 'upcoming',
          startDate:         inv.projectPeriod?.startDate
                               ? new Date(inv.projectPeriod.startDate).toISOString().split('T')[0] : '',
          endDate:           inv.projectPeriod?.endDate
                               ? new Date(inv.projectPeriod.endDate).toISOString().split('T')[0]   : '',
          durationMonths:    inv.projectPeriod?.durationMonths || 0,
          expectedROI:       inv.expectedROI        || 0,
          businessPlan:      inv.businessPlan       || '',
          buildingPlan:      inv.buildingPlan       || '',
          images:            inv.images?.length > 0
                               ? inv.images.map((img: { url: string }) => ({ url: img.url }))
                               : [{ url: '' }],
          isFeatured:        inv.isFeatured         ?? false,
          isActive:          inv.isActive           ?? true,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setPageLoading(false));
  }, [params.id, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError('');
    try {
      await api.put(`/investments/${params.id}`, {
        name:              data.name,
        summary:           data.summary,
        description:       data.description,
        location: { address: data.address, city: data.city, state: data.state, country: data.country },
        totalAmount:       Number(data.totalAmount),
        minimumInvestment: Number(data.minimumInvestment),
        currency:          data.currency,
        projectType:       data.projectType,
        status:            data.status,
        projectPeriod: {
          startDate:      data.startDate ? new Date(data.startDate) : undefined,
          endDate:        data.endDate   ? new Date(data.endDate)   : undefined,
          durationMonths: Number(data.durationMonths) || undefined,
        },
        expectedROI:  Number(data.expectedROI),
        businessPlan: data.businessPlan,
        buildingPlan: data.buildingPlan,
        images:       data.images.filter(img => img.url),
        coverImage:   data.images.find(img => img.url)?.url || '',
        isFeatured:   data.isFeatured,
        isActive:     data.isActive,
      });
      setDone(true);
      setTimeout(() => router.push('/admin/investments'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally { setSaving(false); }
  };

  if (pageLoading) return (
    <div className="space-y-4 animate-pulse max-w-3xl">
      <div className="skeleton h-8 w-1/3" /><div className="skeleton h-64 rounded-xl" />
    </div>
  );
  if (notFound) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🏗️</div>
      <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Investment not found</h2>
      <Link href="/admin/investments" className="btn-primary mt-4 inline-flex">Back to Investments</Link>
    </div>
  );
  if (done) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <CheckCircle size={52} className="text-green-500 mx-auto mb-3" />
        <h2 className="font-display text-xl font-semibold text-[#0B1F3A]">Investment Updated!</h2>
        <p className="text-slate-500 text-sm mt-1">Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/investments" className="text-slate-400 hover:text-[#1E5FBE] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A] truncate">{invName || 'Edit Investment'}</h1>
          <p className="text-slate-500 text-sm">Update investment project details</p>
        </div>
        <Link href={`/admin/investments/${params.id}/payments`}
          className="flex items-center gap-2 px-4 py-2 bg-[#EBF2FF] text-[#1E5FBE] rounded-xl text-sm font-medium hover:bg-[#D1E4FF] transition-colors">
          💰 Payments
          {currentlyRaised > 0 && <span className="text-xs font-bold">{formatCurrency(currentlyRaised, currency)}</span>}
        </Link>
        <Link href={`/investments/${params.id}`} target="_blank"
          className="p-2 text-slate-400 hover:text-[#1E5FBE] transition-colors" title="View live">
          <ExternalLink size={18} />
        </Link>
      </div>

      {/* Funding summary */}
      {currentlyRaised > 0 && (
        <div className="bg-[#EBF2FF] rounded-xl px-5 py-3 flex items-center gap-3 border border-blue-100">
          <span className="text-2xl">📈</span>
          <div>
            <span className="font-semibold text-[#1E5FBE]">{formatCurrency(currentlyRaised, currency)}</span>
            <span className="text-slate-500 text-sm ml-2">raised from confirmed payments</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Project Details */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Project Details</h2>
          <div>
            <label className="form-label">Project Name *</label>
            <input {...register('name', { required: true })} className="form-input" />
          </div>
          <div>
            <label className="form-label">Short Summary *</label>
            <textarea {...register('summary', { required: true })} rows={2} className="form-input resize-none" />
          </div>
          <div>
            <label className="form-label">Full Description *</label>
            <textarea {...register('description', { required: true })} rows={6} className="form-input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Project Type *</label>
              <select {...register('projectType', { required: true })} className="form-input">
                <option value="">Select type</option>
                {Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select {...register('status')} className="form-input">
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="funded">Fully Funded</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Location</h2>
          <div>
            <label className="form-label">Address *</label>
            <input {...register('address', { required: true })} className="form-input" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="form-label">City *</label><input {...register('city', { required: true })} className="form-input" /></div>
            <div><label className="form-label">State *</label><input {...register('state', { required: true })} className="form-input" /></div>
            <div><label className="form-label">Country</label><input {...register('country')} className="form-input" /></div>
          </div>
        </section>

        {/* Financial */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Financial Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Total Amount Needed *</label>
              <input type="number" min={0} {...register('totalAmount', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Minimum Investment *</label>
              <input type="number" min={0} {...register('minimumInvestment', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Expected ROI (%)</label>
              <input type="number" min={0} max={100} {...register('expectedROI', { valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Duration (months)</label>
              <input type="number" min={1} {...register('durationMonths', { valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select {...register('currency')} className="form-input">
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Start Date</label><input type="date" {...register('startDate')} className="form-input" /></div>
            <div><label className="form-label">End Date</label><input type="date" {...register('endDate')} className="form-input" /></div>
          </div>
        </section>

        {/* Documents */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Documents (PDF URLs)</h2>
          <div><label className="form-label">Business Plan URL</label><input {...register('businessPlan')} className="form-input" placeholder="https://res.cloudinary.com/…" /></div>
          <div><label className="form-label">Building Plan URL</label><input {...register('buildingPlan')} className="form-input" placeholder="https://res.cloudinary.com/…" /></div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Images <span className="text-slate-400 font-normal text-sm">(paste any image URL)</span></h2>
          {imageFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`images.${i}.url`)} className="form-input flex-1" placeholder="https://…" />
              <button type="button" onClick={() => removeImage(i)} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addImage({ url: '' })} className="flex items-center gap-1.5 text-sm text-[#1E5FBE] hover:underline">
            <Plus size={14} />Add Image URL
          </button>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3 mb-4">Settings</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isActive')} className="rounded border-slate-300 text-[#1E5FBE]" />
              <span className="text-sm text-slate-700">Active (visible on site)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="rounded border-slate-300 text-[#1E5FBE]" />
              <span className="text-sm text-slate-700">Featured on homepage</span>
            </label>
          </div>
        </section>

        {error && <p className="text-red-500 text-sm bg-red-50 p-4 rounded-xl">{error}</p>}

        <div className="flex justify-end gap-3 pb-8">
          <Link href="/admin/investments" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? <><Loader2 size={16} className="animate-spin" />Saving…</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
