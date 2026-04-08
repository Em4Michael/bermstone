import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, BedDouble, Bath, Zap } from "lucide-react";
import type { Property } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  property: Property;
  featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: Props) {
  const disc = property.discounts?.[0];
  const href = `/keyneet/${property.slug || property._id}`;

  return (
    <Link
      href={href}
      className={`group block bg-white rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(11,31,58,0.18)] ${
        featured
          ? "border-[#1E5FBE]/30 shadow-[0_4px_24px_rgba(30,95,190,0.12)]"
          : "border-blue-50 shadow-[0_4px_24px_rgba(11,31,58,0.07)]"
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Image
          src={
            property.coverImage ||
            property.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
          }
          alt={property.name}
          fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/75 via-[#0B1F3A]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Top badges */}
        <div className="absolute top-3.5 left-3.5 flex gap-2">
          {property.isFeatured && (
            <span className="flex items-center gap-1 bg-[#C9A84C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              <Star size={9} className="fill-white" />
              FEATURED
            </span>
          )}
          {disc && (
            <span className="bg-[#1E5FBE] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              -{disc.percentage}%
            </span>
          )}
        </div>

        {/* Rating pill */}
        {property.totalReviews > 0 && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md">
            <Star size={11} className="fill-[#C9A84C] text-[#C9A84C]" />
            <span className="text-[#0B1F3A] text-xs font-bold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-[10px]">
              ({property.totalReviews})
            </span>
          </div>
        )}

        {/* Price bottom left */}
        <div className="absolute bottom-4 left-4">
          <span className="font-display font-bold text-2xl text-white">
            {formatCurrency(property.pricePerNight, property.currency)}
          </span>
          <span className="text-white/60 text-xs ml-1">/night</span>
        </div>

        {/* "View" pill — appears on hover */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white text-[#0B1F3A] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Zap size={11} className="text-[#C9A84C]" />
          View
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-[#3B9EE0] text-xs font-medium mb-1.5">
          <MapPin size={11} />
          <span>
            {property.location.city}, {property.location.state}
          </span>
        </div>

        <h3 className="font-display font-semibold text-[#0B1F3A] text-lg leading-snug mb-2 group-hover:text-[#1E5FBE] transition-colors duration-300 line-clamp-1">
          {property.name}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 min-h-[2.8rem]">
          {property.summary}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Users size={13} className="text-[#3B9EE0]" />
            {property.maxGuests} guests
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={13} className="text-[#3B9EE0]" />
            {property.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} className="text-[#3B9EE0]" />
            {property.bathrooms} ba
          </span>
        </div>
      </div>
    </Link>
  );
}
