'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Star, Users, BedDouble, Bath, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import type { Property } from '@/types';
import { formatCurrency, AMENITY_ICONS } from '@/lib/utils';
import BookingWidget from '@/components/properties/BookingWidget';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);

  useEffect(() => {
    propertiesApi.getOne(params.id)
      .then((res) => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen pt-20 bg-[#FAFBFF]">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="skeleton h-[480px] rounded-2xl" />
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-4 w-full" />
      </div>
    </div>
  );

  if (!property) return notFound();

  const imgs = property.images?.length > 0 ? property.images : [{ url: property.coverImage || '' }];

  return (
    <div className="min-h-screen pt-20 bg-[#FAFBFF]">
      {/* Gallery */}
      <div className="relative bg-[#0B1F3A]">
        <div className="relative aspect-[16/7] max-h-[560px] overflow-hidden">
          <Image
            src={imgs[imgIdx]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'}
            alt={property.name} fill priority className="object-cover opacity-90"
          />
          {imgs.length > 1 && (
            <>
              <button onClick={() => setImgIdx((i) => (i - 1 + imgs.length) % imgs.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setImgIdx((i) => (i + 1) % imgs.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white">
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/50 w-2'}`} />
                ))}
              </div>
            </>
          )}
        </div>
        {imgs.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-[#071F4A]">
            {imgs.slice(0, 8).map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-[#3B9EE0]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex items-center gap-1 text-[#3B9EE0] text-xs font-medium mb-2">
                <MapPin size={14} />
                <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#0B1F3A] mb-3">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Users size={15} className="text-[#3B9EE0]" />{property.maxGuests} guests</span>
                <span className="flex items-center gap-1.5"><BedDouble size={15} className="text-[#3B9EE0]" />{property.bedrooms} bedrooms</span>
                <span className="flex items-center gap-1.5"><Bath size={15} className="text-[#3B9EE0]" />{property.bathrooms} bathrooms</span>
                {property.totalReviews > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={14} className="fill-[#C9A84C] text-[#C9A84C]" />
                    <strong>{property.averageRating.toFixed(1)}</strong>
                    <span className="text-slate-400">({property.totalReviews})</span>
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-4">About this property</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description || property.summary}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="text-lg">{AMENITY_ICONS[a] || '✓'}</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.rules?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-4">House Rules</h2>
                <ul className="space-y-2">
                  {property.rules.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={15} className="text-[#3B9EE0] mt-0.5 shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.discounts?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-4">Special Discounts</h2>
                <div className="flex flex-wrap gap-3">
                  {property.discounts.map((d) => (
                    <div key={d.label} className="bg-[#EBF2FF] border border-blue-100 rounded-xl px-4 py-3">
                      <div className="text-[#1E5FBE] font-semibold text-lg">{d.percentage}% off</div>
                      <div className="text-slate-500 text-xs">{d.label} · {d.minNights}+ nights</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.bookingLink && (
              <a href={property.bookingLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-secondary">
                <ExternalLink size={15} />Book via External Platform
              </a>
            )}
          </div>

          {/* Right: Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
