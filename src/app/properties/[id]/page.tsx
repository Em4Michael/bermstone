'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, Users, BedDouble, Bath, Check, ExternalLink,
  ChevronLeft, ChevronRight, Heart, Share2, X,
} from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import type { Property } from '@/types';
import { formatCurrency, AMENITY_ICONS } from '@/lib/utils';
import BookingWidget from '@/components/properties/BookingWidget';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [property,  setProperty]  = useState<Property | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [imgIdx,    setImgIdx]    = useState(0);
  const [lightbox,  setLightbox]  = useState(false);
  const [wishlisted, setWished]   = useState(false);
  const [showAll,   setShowAll]   = useState(false);

  useEffect(() => {
    propertiesApi.getOne(params.id)
      .then(res => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="shimmer h-[60vh] w-full" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="shimmer h-10 w-2/3 rounded-xl" />
          <div className="shimmer h-5  w-1/2 rounded-xl" />
          <div className="shimmer h-40 w-full rounded-xl" />
        </div>
        <div className="shimmer h-80 rounded-2xl" />
      </div>
    </div>
  );

  if (!property) return notFound();

  const imgs = property.images?.length > 0 ? property.images : [{ url: property.coverImage || '', caption: '' }];
  const amenityList = showAll ? property.amenities : (property.amenities || []).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#FAFBFF]">

      {/* ── Cinematic Gallery ─────────────────────────────── */}
      <div className="relative bg-[#0B1F3A] pt-20">
        {/* Main image */}
        <div className="relative overflow-hidden" style={{ height: 'clamp(320px, 60vw, 580px)' }}>
          <Image
            src={imgs[imgIdx]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400'}
            alt={property.name} fill priority
            className="object-cover transition-all duration-700 ease-out"
            style={{ transform: 'scale(1.02)' }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-[#0B1F3A]/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/30 via-transparent to-transparent" />

          {/* Image counter */}
          <div className="absolute top-5 right-5 glass rounded-full px-3 py-1 text-white text-xs font-medium">
            {imgIdx + 1} / {imgs.length}
          </div>

          {/* Actions */}
          <div className="absolute top-5 left-5 flex gap-2">
            <button onClick={() => setWished(!wishlisted)}
              className={`glass w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${wishlisted ? 'bg-red-500/90' : ''}`}>
              <Heart size={16} className={wishlisted ? 'fill-white text-white' : 'text-white'} />
            </button>
            <button className="glass w-10 h-10 rounded-full flex items-center justify-center" onClick={() => navigator.share?.({ title: property.name, url: window.location.href })}>
              <Share2 size={16} className="text-white" />
            </button>
          </div>

          {/* Nav arrows */}
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

          {/* Bottom info overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <MapPin size={13} />
                  <span>{property.location.address}, {property.location.city}</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">{property.name}</h1>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold text-white">{formatCurrency(property.pricePerNight, property.currency)}</div>
                <div className="text-white/60 text-sm">/night</div>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          {imgs.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === imgIdx ? 'bg-white w-5 h-1.5' : 'bg-white/40 w-1.5 h-1.5'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {imgs.length > 1 && (
          <div className="flex gap-2 px-4 py-2 bg-[#071528] overflow-x-auto scrollbar-hide">
            {imgs.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  i === imgIdx ? 'ring-2 ring-[#C9A84C] scale-105' : 'opacity-50 hover:opacity-80'
                }`}>
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
            {imgs.length > 1 && (
              <button onClick={() => setLightbox(true)}
                className="w-20 h-14 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-white/70 text-xs hover:bg-white/20 transition-all">
                All {imgs.length}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
            <X size={18} />
          </button>
          <div className="relative max-w-4xl w-full aspect-[16/9]">
            <Image src={imgs[imgIdx]?.url} alt="" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Stats bar */}
            <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Users size={18} className="text-[#3B9EE0]" />, label: 'Guests',    val: `${property.maxGuests} max` },
                { icon: <BedDouble size={18} className="text-[#3B9EE0]" />, label: 'Bedrooms', val: `${property.bedrooms} bd` },
                { icon: <Bath size={18} className="text-[#3B9EE0]" />,   label: 'Bathrooms', val: `${property.bathrooms} ba` },
                { icon: <Star size={18} className="text-[#C9A84C]" />,   label: 'Rating',    val: property.totalReviews > 0 ? `${property.averageRating.toFixed(1)} (${property.totalReviews})` : 'New' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="bg-white rounded-2xl border border-blue-50 p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] flex items-center justify-center shrink-0">{icon}</div>
                  <div>
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="font-semibold text-[#0B1F3A] text-sm">{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="reveal">
              <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-4">About this Keyneet</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description || property.summary}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-6">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 reveal-stagger">
                  {amenityList.map(a => (
                    <div key={a} className="flex items-center gap-2.5 bg-white border border-blue-50 rounded-xl px-3 py-2.5 text-sm shadow-sm hover:border-[#1E5FBE]/30 hover:shadow-md transition-all">
                      <span className="text-xl">{AMENITY_ICONS[a] || '✓'}</span>
                      <span className="text-slate-700 font-medium">{a}</span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 8 && (
                  <button onClick={() => setShowAll(!showAll)}
                    className="mt-4 text-sm text-[#1E5FBE] font-medium hover:underline flex items-center gap-1">
                    {showAll ? '← Show less' : `Show all ${property.amenities.length} amenities →`}
                  </button>
                )}
              </div>
            )}

            {/* Discounts */}
            {property.discounts?.length > 0 && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-4">Stay Longer, Save More</h2>
                <div className="flex flex-wrap gap-3 reveal-stagger">
                  {property.discounts.map(d => (
                    <div key={d.label}
                      className="relative bg-gradient-to-br from-[#EBF2FF] to-[#D4E6FF] border border-blue-200 rounded-2xl px-5 py-4 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#1E5FBE]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="text-[#1E5FBE] font-display font-bold text-2xl">{d.percentage}% off</div>
                      <div className="text-slate-600 text-sm mt-0.5">{d.label} · {d.minNights}+ nights</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {property.rules?.length > 0 && (
              <div className="reveal">
                <h2 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-4">House Rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.rules.map(r => (
                    <div key={r} className="flex items-center gap-2.5 text-sm text-slate-600 py-2 border-b border-slate-100 last:border-0">
                      <Check size={15} className="text-[#3B9EE0] shrink-0" />{r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.bookingLink && (
              <div className="reveal">
                <a href={property.bookingLink} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary inline-flex">
                  <ExternalLink size={16} />Book via WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Right column — Booking widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 animate-fade-left" style={{ animationDelay: '200ms' }}>
              <BookingWidget property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
