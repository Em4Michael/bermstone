'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle } from 'lucide-react';
import { inquiriesApi } from '@/lib/api';

interface FormData {
  firstName: string; lastName: string; email: string; phone: string; company?: string;
  propertyName?: string; address?: string; city?: string; propertyType?: string;
  bedrooms?: number; bathrooms?: number; message: string;
}

export default function OwnerSupportPage() {
  const [done,   setDone]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await inquiriesApi.submit({
        type: 'owner_listing', firstName: data.firstName, lastName: data.lastName,
        email: data.email, phone: data.phone, company: data.company, message: data.message,
        propertyDetails: {
          propertyName: data.propertyName, address: data.address, city: data.city,
          propertyType: data.propertyType,
          bedrooms:  data.bedrooms  ? Number(data.bedrooms)  : undefined,
          bathrooms: data.bathrooms ? Number(data.bathrooms) : undefined,
        },
      });
      setDone(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setSaving(false); }
  };

  const BENEFITS = [
    { icon: '📈', title: 'Maximise Revenue',    desc: 'Dynamic pricing and premium listings consistently achieve 80–95% occupancy.' },
    { icon: '🛡️', title: 'Property Protection', desc: 'Thorough guest vetting, security deposits, and comprehensive inspections.' },
    { icon: '📊', title: 'Monthly Reports',     desc: 'Transparent revenue reports with booking data and maintenance logs.' },
    { icon: '⚙️', title: 'Full Management',     desc: 'Guest communication, cleaning, restocking, and maintenance — all handled.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-14 px-4 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#1E5FBE]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="section-label text-[#3B9EE0]">Property Owners</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mt-2 mb-4">List Your Property with Bermstone</h1>
          <p className="text-blue-200 leading-relaxed">Join our exclusive portfolio. We handle everything while you earn.</p>
        </div>
      </div>

      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] text-center mb-10">Why Partner with Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon, title, desc }) => (
              <div key={title} className="group">
                <div className="w-12 h-12 rounded-xl bg-[#EBF2FF] flex items-center justify-center mb-4 text-2xl group-hover:bg-[#1E5FBE] transition-colors">{icon}</div>
                <h3 className="font-semibold text-[#0B1F3A] mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-[#F3F7FF]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-2">Submit Your Property</h2>
            <p className="text-slate-500 text-sm">Our team will be in touch within 24 hours.</p>
          </div>
          <div className="card p-8">
            {done ? (
              <div className="text-center py-8">
                <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Submission Received!</h3>
                <p className="text-slate-500 text-sm">We&apos;ll review and contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">First Name</label><input {...register('firstName',{required:true})} className="form-input" /></div>
                  <div><label className="form-label">Last Name</label><input  {...register('lastName', {required:true})} className="form-input" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">Email</label><input type="email" {...register('email',{required:true})} className="form-input" /></div>
                  <div><label className="form-label">Phone</label><input type="tel"   {...register('phone',{required:true})} className="form-input" /></div>
                </div>
                <div><label className="form-label">Property Name</label><input {...register('propertyName')} className="form-input" placeholder="e.g. The Palm Garden Suite" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="form-label">Address</label><input {...register('address')} className="form-input" /></div>
                  <div><label className="form-label">City</label><input {...register('city')} className="form-input" placeholder="Port Harcourt" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="form-label">Type</label>
                    <select {...register('propertyType')} className="form-input">
                      <option value="">Select</option>
                      {['Studio','1 Bedroom Flat','2 Bedroom Flat','3 Bedroom Flat','Duplex','Penthouse','Villa','Other'].map((t) => <option key={t}>{t}</option>)}
                    </select></div>
                  <div><label className="form-label">Bedrooms</label><input type="number" min={0} {...register('bedrooms')} className="form-input" /></div>
                  <div><label className="form-label">Bathrooms</label><input type="number" min={0} {...register('bathrooms')} className="form-input" /></div>
                </div>
                <div><label className="form-label">Additional Information</label><textarea {...register('message',{required:true})} rows={4} className="form-input resize-none" placeholder="Tell us about your property and goals..." /></div>
                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                <button type="submit" disabled={saving} className="btn-primary w-full">
                  {saving ? <><Loader2 size={16} className="animate-spin" />Submitting...</> : 'Submit Property Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
