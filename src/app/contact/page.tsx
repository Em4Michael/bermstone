'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { inquiriesApi } from '@/lib/api';

interface FormData { firstName: string; lastName: string; email: string; phone: string; subject?: string; message: string; }

export default function ContactPage() {
  const [done,   setDone]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try { await inquiriesApi.submit({ type: 'general_contact', ...data }); setDone(true); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed to send'); }
    finally { setSaving(false); }
  };

  const CONTACTS = [
    { icon: <Phone size={18} className="text-[#1E5FBE]" />, label: 'Phone',   value: '+212 600 359 326',           href: 'tel:+212600359326' },
    { icon: <Mail  size={18} className="text-[#1E5FBE]" />, label: 'Email',   value: 'Realdelly@yahoo.com',         href: 'mailto:Realdelly@yahoo.com' },
    { icon: <MapPin size={18} className="text-[#1E5FBE]" />,label: 'Address', value: 'Marrakech, Marrakech-Safi', href: null },
    { icon: <Clock size={18} className="text-[#1E5FBE]" />, label: 'Hours',   value: 'Mon–Fri: 8am–6pm\nSat: 9am–3pm', href: null },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label text-[#3B9EE0]">Get In Touch</span>
          <h1 className="font-display text-4xl font-semibold text-white mt-2 mb-3">We&apos;d Love to Hear from You</h1>
          <p className="text-blue-200 text-sm">Whether you have a question, want to book, or explore an investment — we&apos;re here.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-semibold text-[#0B1F3A]">Contact Information</h2>
            {CONTACTS.map(({ icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] flex items-center justify-center shrink-0">{icon}</div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
                  {href ? <a href={href} className="text-sm text-[#0B1F3A] hover:text-[#1E5FBE] font-medium whitespace-pre-line">{value}</a>
                        : <p className="text-sm text-[#0B1F3A] font-medium whitespace-pre-line">{value}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="card p-8">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">We&apos;ll respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="form-label">First Name</label><input {...register('firstName', { required: true })} className="form-input" /></div>
                    <div><label className="form-label">Last Name</label><input  {...register('lastName',  { required: true })} className="form-input" /></div>
                  </div>
                  <div><label className="form-label">Email</label><input type="email" {...register('email', { required: true })} className="form-input" /></div>
                  <div><label className="form-label">Phone</label><input type="tel"   {...register('phone', { required: true })} className="form-input" /></div>
                  <div><label className="form-label">Subject (optional)</label><input {...register('subject')} className="form-input" /></div>
                  <div><label className="form-label">Message</label><textarea {...register('message', { required: true })} rows={5} className="form-input resize-none" /></div>
                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                  <button type="submit" disabled={saving} className="btn-primary w-full">
                    {saving ? <><Loader2 size={16} className="animate-spin" />Sending...</> : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}