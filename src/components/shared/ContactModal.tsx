'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Mail, Loader2, CheckCircle, Send } from 'lucide-react';
import { inquiriesApi } from '@/lib/api';

interface Props {
  open:    boolean;
  onClose: () => void;
  context: {
    type:     'property' | 'investment';
    name:     string;   // property or investment name
    subject?: string;
  };
}

interface FormData {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  message:   string;
}

export default function ContactModal({ open, onClose, context }: Props) {
  const [done,   setDone]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError('');
    try {
      await inquiriesApi.submit({
        type:      'general_contact',
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone,
        subject:   context.subject || `Enquiry about ${context.name}`,
        message:   data.message,
        ...(context.type === 'property'
          ? { propertyDetails:   { propertyName: context.name } }
          : { investmentDetails: { projectOfInterest: context.name } }
        ),
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => { setDone(false); setError(''); reset(); }, 300);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(11,31,58,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={handleClose}>

      {/* Panel */}
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1E5FBE] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Mail size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-lg leading-tight">Send a Message</h3>
              <p className="text-white/60 text-xs mt-0.5 truncate max-w-[240px]">{context.name}</p>
            </div>
          </div>
          <button onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {done ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h4 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Message Sent!</h4>
              <p className="text-slate-500 text-sm mb-6">
                Thank you for reaching out. Boobo London will reply to <strong>{}</strong> within 24 hours.
              </p>
              <button onClick={handleClose}
                className="btn-primary text-sm px-8">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">First Name *</label>
                  <input
                    {...register('firstName', { required: 'Required' })}
                    className="form-input"
                    placeholder="Your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input
                    {...register('lastName', { required: 'Required' })}
                    className="form-input"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  className="form-input"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Required' })}
                  className="form-input"
                  placeholder="+212 6XX XXX XXX"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="form-label">Message *</label>
                <textarea
                  {...register('message', { required: 'Required', minLength: { value: 10, message: 'At least 10 characters' } })}
                  rows={4}
                  className="form-input resize-none"
                  placeholder={`Hi, I am interested in ${context.name} and would like to know more…`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving
                    ? <><Loader2 size={15} className="animate-spin" />Sending…</>
                    : <><Send size={15} />Send Message</>
                  }
                </button>
              </div>

              <p className="text-center text-xs text-slate-400">
                We typically reply within 24 hours · Realdelly@yahoo.com
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}