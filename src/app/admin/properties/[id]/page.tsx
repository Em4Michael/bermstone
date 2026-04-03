'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

const AMENITY_LIST = [
  'WiFi','Pool','Gym','Parking','Air Conditioning','Kitchen','Washer',
  'TV','Balcony','Sea View','Generator','Security','Elevator','Garden',
];

interface FormData {
  name: string; summary: string; description: string;
  address: string; city: string; state: string; country: string;
  pricePerNight: number; currency: string;
  maxGuests: number; bedrooms: number; bathrooms: number;
  amenities: string[];
  rules: { value: string }[];
  images: { url: string; caption: string }[];
  bookingLink: string;
  isFeatured: boolean; isActive: boolean;
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');
  const [notFound, setNotFound] = useState(false);

  const { register, handleSubmit, control, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      country: 'Nigeria', currency: 'NGN',
      isFeatured: false, isActive: true,
      amenities: [],
      rules:  [{ value: '' }],
      images: [{ url: '', caption: '' }],
    },
  });

  const { fields: ruleFields,  append: addRule,  remove: removeRule  } = useFieldArray({ control, name: 'rules' });
  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({ control, name: 'images' });

  const selectedAmenities = watch('amenities') || [];

  const toggleAmenity = (a: string) => {
    const cur = watch('amenities') || [];
    setValue('amenities', cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]);
  };

  // Load existing property data
  useEffect(() => {
    // Guard: 'new' is a static route, redirect there if somehow we land here
    if (params.id === 'new') { router.replace('/admin/properties/new'); return; }
    api.get(`/properties/${params.id}`)
      .then((res) => {
        const p = res.data.data;
        reset({
          name:         p.name         || '',
          summary:      p.summary      || '',
          description:  p.description  || '',
          address:      p.location?.address || '',
          city:         p.location?.city    || '',
          state:        p.location?.state   || '',
          country:      p.location?.country || 'Nigeria',
          pricePerNight: p.pricePerNight || 0,
          currency:     p.currency     || 'NGN',
          maxGuests:    p.maxGuests    || 1,
          bedrooms:     p.bedrooms     || 0,
          bathrooms:    p.bathrooms    || 0,
          amenities:    p.amenities    || [],
          rules:        p.rules?.length > 0
                          ? p.rules.map((r: string) => ({ value: r }))
                          : [{ value: '' }],
          images:       p.images?.length > 0
                          ? p.images.map((img: { url: string; caption?: string }) => ({ url: img.url, caption: img.caption || '' }))
                          : [{ url: '', caption: '' }],
          bookingLink:  p.bookingLink  || '',
          isFeatured:   p.isFeatured   ?? false,
          isActive:     p.isActive     ?? true,
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true); setError('');
    try {
      await api.put(`/properties/${params.id}`, {
        name:        data.name,
        summary:     data.summary,
        description: data.description,
        location: {
          address: data.address,
          city:    data.city,
          state:   data.state,
          country: data.country,
        },
        pricePerNight: Number(data.pricePerNight),
        currency:     data.currency,
        maxGuests:    Number(data.maxGuests),
        bedrooms:     Number(data.bedrooms),
        bathrooms:    Number(data.bathrooms),
        amenities:    data.amenities,
        rules:        data.rules.map((r) => r.value).filter(Boolean),
        images:       data.images.filter((img) => img.url),
        coverImage:   data.images.find((img) => img.url)?.url || '',
        bookingLink:  data.bookingLink,
        isFeatured:   data.isFeatured,
        isActive:     data.isActive,
      });
      setDone(true);
      setTimeout(() => router.push('/admin/properties'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl">
      <div className="skeleton h-8 w-1/3" />
      <div className="skeleton h-64 rounded-xl" />
      <div className="skeleton h-40 rounded-xl" />
    </div>
  );

  if (notFound) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🏘️</div>
      <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Property not found</h2>
      <Link href="/admin/properties" className="btn-primary mt-4 inline-flex">Back to Properties</Link>
    </div>
  );

  if (done) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <CheckCircle size={52} className="text-green-500 mx-auto mb-3" />
        <h2 className="font-display text-xl font-semibold text-[#0B1F3A]">Property Updated!</h2>
        <p className="text-slate-500 text-sm mt-1">Redirecting to properties list…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/properties" className="text-slate-400 hover:text-[#1E5FBE] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Edit Property</h1>
          <p className="text-slate-500 text-sm">Update the property details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Basic Info */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Basic Information</h2>
          <div>
            <label className="form-label">Property Name *</label>
            <input {...register('name', { required: true })} className="form-input" placeholder="e.g. Skyline Executive Suite" />
          </div>
          <div>
            <label className="form-label">Short Summary * <span className="text-slate-400 font-normal">(max 300 chars)</span></label>
            <textarea {...register('summary', { required: true, maxLength: 300 })} rows={2} className="form-input resize-none" />
          </div>
          <div>
            <label className="form-label">Full Description *</label>
            <textarea {...register('description', { required: true })} rows={6} className="form-input resize-none" />
          </div>
        </section>

        {/* Location */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Location</h2>
          <div>
            <label className="form-label">Full Address *</label>
            <input {...register('address', { required: true })} className="form-input" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">City *</label>
              <input {...register('city', { required: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">State *</label>
              <input {...register('state', { required: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Country</label>
              <input {...register('country')} className="form-input" />
            </div>
          </div>
        </section>

        {/* Pricing & Capacity */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Pricing & Capacity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Price Per Night *</label>
              <input type="number" min={0} {...register('pricePerNight', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select {...register('currency')} className="form-input">
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Max Guests *</label>
              <input type="number" min={1} {...register('maxGuests', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Bedrooms *</label>
              <input type="number" min={0} {...register('bedrooms', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Bathrooms *</label>
              <input type="number" min={0} {...register('bathrooms', { required: true, valueAsNumber: true })} className="form-input" />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((a) => {
              const active = selectedAmenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    active ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 text-slate-600 hover:border-[#1E5FBE]'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </section>

        {/* House Rules */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">House Rules</h2>
          {ruleFields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`rules.${i}.value`)}
                className="form-input flex-1"
                placeholder={`Rule ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeRule(i)}
                className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addRule({ value: '' })}
            className="flex items-center gap-1.5 text-sm text-[#1E5FBE] hover:underline"
          >
            <Plus size={14} />Add Rule
          </button>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Images
            <span className="text-slate-400 font-normal text-sm ml-2">(paste any image URL)</span>
          </h2>
          {imageFields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-3 gap-2">
              <input
                {...register(`images.${i}.url`)}
                className="form-input col-span-2"
                placeholder="https://res.cloudinary.com/…  or  https://images.unsplash.com/…"
              />
              <div className="flex gap-2">
                <input
                  {...register(`images.${i}.caption`)}
                  className="form-input flex-1"
                  placeholder="Caption"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addImage({ url: '', caption: '' })}
            className="flex items-center gap-1.5 text-sm text-[#1E5FBE] hover:underline"
          >
            <Plus size={14} />Add Image URL
          </button>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">Settings</h2>
          <div>
            <label className="form-label">Booking / WhatsApp Link</label>
            <input {...register('bookingLink')} className="form-input" placeholder="https://wa.me/234…" />
          </div>
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

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-4 rounded-xl">{error}</p>
        )}

        <div className="flex justify-end gap-3 pb-8">
          <Link href="/admin/properties" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? <><Loader2 size={16} className="animate-spin" />Saving…</>
              : 'Save Changes'
            }
          </button>
        </div>
      </form>
    </div>
  );
}
