'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, Users, User, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import type { Property } from '@/types';
import { formatCurrency, calcNights } from '@/lib/utils';

interface Props { property: Property }
interface FormData {
  checkIn: string; checkOut: string; guests: number;
  firstName: string; lastName: string; email: string; phone: string;
  specialRequests?: string;
}

export default function BookingWidget({ property }: Props) {
  const [step,     setStep]     = useState<'form' | 'success'>('form');
  const [nights,   setNights]   = useState(0);
  const [total,    setTotal]    = useState(0);
  const [discount, setDiscount] = useState(0);
  const [ref,      setRef]      = useState('');
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const { register, handleSubmit, watch } = useForm<FormData>();
  const checkIn  = watch('checkIn');
  const checkOut = watch('checkOut');

  const recalc = () => {
    if (!checkIn || !checkOut) return;
    const n = calcNights(checkIn, checkOut);
    if (n <= 0) return;
    const sub  = property.pricePerNight * n;
    const best = (property.discounts || [])
      .filter((d) => n >= d.minNights)
      .reduce((a, b) => a.percentage > b.percentage ? a : b, { percentage: 0, minNights: 0, label: '' });
    const disc = best.percentage ? (sub * best.percentage) / 100 : 0;
    setNights(n); setDiscount(disc); setTotal(sub - disc);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError('');
    try {
      const res = await bookingsApi.create({
        property: property._id,
        checkIn: data.checkIn, checkOut: data.checkOut,
        guests: Number(data.guests),
        guestInfo: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
        specialRequests: data.specialRequests,
      });
      setRef(res.data.bookingReference);
      setStep('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally { setSaving(false); }
  };

  if (step === 'success') return (
    <div className="card p-7 text-center">
      <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
      <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Booking Confirmed!</h3>
      <p className="text-slate-500 text-sm mb-4">Your reference number:</p>
      <div className="bg-[#EBF2FF] rounded-xl py-3 px-5 font-mono font-bold text-[#1E5FBE] text-lg mb-4">{ref}</div>
      <p className="text-slate-400 text-xs">Our team will contact you shortly.</p>
    </div>
  );

  return (
    <div className="card p-6">
      <div className="mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-3xl font-bold text-[#0B1F3A]">{formatCurrency(property.pricePerNight, property.currency)}</span>
          <span className="text-slate-500 text-sm">/night</span>
        </div>
        {property.totalReviews > 0 && (
          <div className="text-sm text-slate-500 mt-1">⭐ {property.averageRating?.toFixed(1)} · {property.totalReviews} reviews</div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="form-label">Check-in</label>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" {...register('checkIn', { required: true })}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => { register('checkIn').onChange(e); setTimeout(recalc, 50); }}
                className="form-input pl-9 text-xs" />
            </div>
          </div>
          <div>
            <label className="form-label">Check-out</label>
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="date" {...register('checkOut', { required: true })}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => { register('checkOut').onChange(e); setTimeout(recalc, 50); }}
                className="form-input pl-9 text-xs" />
            </div>
          </div>
        </div>

        <div>
          <label className="form-label">Guests</label>
          <div className="relative">
            <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select {...register('guests', { required: true })} className="form-input pl-9">
              {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {nights > 0 && (
          <div className="bg-[#F8FAFF] rounded-xl p-4 text-sm space-y-2 border border-blue-50">
            <div className="flex justify-between text-slate-600">
              <span>{formatCurrency(property.pricePerNight, property.currency)} × {nights} nights</span>
              <span>{formatCurrency(property.pricePerNight * nights, property.currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-{formatCurrency(discount, property.currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-[#0B1F3A] pt-2 border-t border-blue-100">
              <span>Total</span><span>{formatCurrency(total, property.currency)}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Details</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="First name" {...register('firstName', { required: true })} className="form-input pl-8 text-sm" />
            </div>
            <input placeholder="Last name" {...register('lastName', { required: true })} className="form-input text-sm" />
          </div>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" placeholder="Email" {...register('email', { required: true })} className="form-input pl-8 text-sm" />
          </div>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="tel" placeholder="Phone" {...register('phone', { required: true })} className="form-input pl-8 text-sm" />
          </div>
          <textarea placeholder="Special requests (optional)" {...register('specialRequests')} rows={2} className="form-input text-sm resize-none" />
        </div>

        {error && <p className="text-red-500 text-xs bg-red-50 p-3 rounded-lg">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
          {saving ? <><Loader2 size={16} className="animate-spin" />Processing...</> : 'Request Booking'}
        </button>
        <p className="text-center text-xs text-slate-400">No payment charged yet. We&apos;ll confirm availability first.</p>
      </form>
    </div>
  );
}
