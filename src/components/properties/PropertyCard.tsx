import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Users, BedDouble, Bath } from 'lucide-react';
import type { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface Props { property: Property; featured?: boolean }

export default function PropertyCard({ property, featured = false }: Props) {
  const disc = property.discounts?.[0];
  return (
    <Link href={`/properties/${property.slug || property._id}`}
      className={`card group block overflow-hidden ${featured ? 'ring-2 ring-[#1E5FBE]/20' : ''}`}>

      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={property.coverImage || property.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={property.name} fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isFeatured && <span className="badge bg-[#C9A84C] text-white text-xs">⭐ Featured</span>}
          {disc && <span className="badge bg-[#1E5FBE] text-white text-xs">-{disc.percentage}%</span>}
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-display font-semibold text-xl">{formatCurrency(property.pricePerNight, property.currency)}</span>
          <span className="text-white/80 text-xs ml-1">/night</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 text-[#3B9EE0] text-xs font-medium mb-1">
          <MapPin size={12} /><span>{property.location.city}, {property.location.state}</span>
        </div>
        <h3 className="font-display font-semibold text-[#0B1F3A] text-lg leading-tight mb-2 group-hover:text-[#1E5FBE] transition-colors line-clamp-1">{property.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{property.summary}</p>
        <div className="flex items-center gap-4 text-sm text-slate-600 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1.5"><Users size={14} className="text-[#3B9EE0]" />{property.maxGuests} guests</span>
          <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-[#3B9EE0]" />{property.bedrooms} bd</span>
          <span className="flex items-center gap-1.5"><Bath size={14} className="text-[#3B9EE0]" />{property.bathrooms} ba</span>
          {property.totalReviews > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs font-medium">
              <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
              {property.averageRating.toFixed(1)}<span className="text-slate-400">({property.totalReviews})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
