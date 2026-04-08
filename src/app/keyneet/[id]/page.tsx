"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  Mail,
  Wifi,
  Wind,
  Car,
  Dumbbell,
  Tv,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import BookingWidget from "@/components/properties/BookingWidget";
import ContactModal from "@/components/shared/ContactModal";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={16} />,
  "Air Conditioning": <Wind size={16} />,
  Parking: <Car size={16} />,
  Gym: <Dumbbell size={16} />,
  TV: <Tv size={16} />,
  Security: <ShieldCheck size={16} />,
  Pool: <Waves size={16} />,
};

function GalleryGrid({
  images,
  onOpen,
}: {
  images: { url: string; caption?: string }[];
  onOpen: (i: number) => void;
}) {
  const main = images[0];
  const sides = images.slice(1, 5);

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[70vh] max-h-[620px]">
      {/* Main large image */}
      <div
        className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl cursor-pointer group"
        onClick={() => onOpen(0)}
      >
        <Image
          src={
            main?.url ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"
          }
          alt="Main"
          fill
          priority
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Side images 2×2 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden cursor-pointer group",
            i === 0 ? "rounded-tr-2xl" : "",
            i === 3 ? "rounded-br-2xl" : "",
          )}
          onClick={() => onOpen(i + 1)}
        >
          {sides[i] ? (
            <>
              <Image
                src={sides[i].url}
                alt=""
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* "Show all" overlay on last tile */}
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    +{images.length - 5} photos
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-slate-100" />
          )}
        </div>
      ))}
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: { url: string }[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onChange]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <span className="text-white/50 text-sm">
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + images.length) % images.length);
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % images.length);
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div
        className="relative w-full max-w-5xl mx-6 aspect-[16/9]"
        onClick={(e) => e.stopPropagation()}
      >
        {images[index]?.url ? (
          <Image
            src={images[index].url}
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            No image
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg px-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onChange(i);
            }}
            className={cn(
              "relative w-16 h-10 shrink-0 rounded-lg overflow-hidden transition-all",
              i === index
                ? "ring-2 ring-[#C9A84C] opacity-100"
                : "opacity-40 hover:opacity-70",
            )}
          >
            {img.url && (
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWished] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    propertiesApi
      .getOne(params.id)
      .then((res) => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <div className="shimmer h-[70vh] rounded-2xl" />
          <div className="shimmer h-8 w-1/2 rounded-xl" />
          <div className="shimmer h-4 w-1/3 rounded-lg" />
        </div>
      </div>
    );

  if (!property) return notFound();

  // Filter out images with empty URLs, fall back to coverImage or placeholder
  const rawImgs = property.images?.filter((img) => img.url?.trim()) || [];
  const imgs =
    rawImgs.length > 0
      ? rawImgs
      : [
          {
            url:
              property.coverImage?.trim() ||
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
            caption: "",
          },
        ];

  const amenityList = showAll
    ? property.amenities || []
    : (property.amenities || []).slice(0, 10);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Floating sticky bar on scroll ──────────────── */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 transition-all duration-300",
          scrolled ? "translate-y-0 shadow-sm" : "-translate-y-full",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-[#0B1F3A] text-lg leading-none">
              {property.name}
            </h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
              <MapPin size={11} />
              {property.location.city}, {property.location.country}
              {property.totalReviews > 0 && (
                <span className="flex items-center gap-0.5 ml-2">
                  <Star size={11} className="fill-[#C9A84C] text-[#C9A84C]" />
                  {property.averageRating.toFixed(1)} · {property.totalReviews}{" "}
                  reviews
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-xl text-[#0B1F3A]">
              {formatCurrency(property.pricePerNight, property.currency)}
              <span className="text-slate-400 font-normal text-sm">/night</span>
            </span>
            {property.bookingLink && (
              <a
                href={property.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2"
              >
                Book Now
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* ── Gallery ─────────────────────────────────────── */}
        <div className="relative mb-8" ref={headerRef}>
          <GalleryGrid
            images={imgs}
            onOpen={(i) => {
              setImgIdx(i);
              setLightbox(true);
            }}
          />

          {/* Floating actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setWished(!wishlisted)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300 shadow-md",
                wishlisted
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white/90 border-white/50 text-slate-700 hover:bg-white",
              )}
            >
              <Heart size={15} className={wishlisted ? "fill-white" : ""} />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center text-slate-700 hover:bg-white transition-all shadow-md"
              onClick={() =>
                navigator.share?.({
                  title: property.name,
                  url: window.location.href,
                })
              }
            >
              <Share2 size={15} />
            </button>
          </div>

          {/* View all photos button */}
          {imgs.length > 1 && (
            <button
              onClick={() => {
                setImgIdx(0);
                setLightbox(true);
              }}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 hover:bg-white backdrop-blur-sm border border-slate-200 text-[#0B1F3A] text-sm font-medium px-4 py-2 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              ⊞ All {imgs.length} photos
            </button>
          )}
        </div>

        {/* ── Title row ───────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-10 pb-8 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1E5FBE] bg-[#EBF2FF] px-3 py-1 rounded-full">
                Keyneet
              </span>
              {property.isFeatured && (
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-[#C9A84C]" /> Featured
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#0B1F3A] leading-tight mb-3">
              {property.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#1E5FBE]" />
                {property.location.address}, {property.location.city},{" "}
                {property.location.country}
              </span>
              {property.totalReviews > 0 && (
                <span className="flex items-center gap-1 text-[#0B1F3A] font-medium">
                  <Star size={14} className="fill-[#C9A84C] text-[#C9A84C]" />
                  {property.averageRating.toFixed(1)}
                  <span className="text-slate-400 font-normal">
                    ({property.totalReviews} reviews)
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="lg:text-right shrink-0">
            <div className="font-display text-4xl font-bold text-[#0B1F3A]">
              {formatCurrency(property.pricePerNight, property.currency)}
            </div>
            <div className="text-slate-400 text-sm">
              per night · taxes included
            </div>
            {property.discounts?.length > 0 && (
              <div className="mt-1 text-[#1E5FBE] text-xs font-medium">
                Save up to{" "}
                {Math.max(...property.discounts.map((d) => d.percentage))}% on
                longer stays
              </div>
            )}
          </div>
        </div>

        {/* ── Main content grid ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* ── Left ────────────────────────────────────────── */}
          <div className="space-y-14">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: <Users size={22} />,
                  label: "Guests",
                  val: `Up to ${property.maxGuests}`,
                },
                {
                  icon: <BedDouble size={22} />,
                  label: "Bedrooms",
                  val: `${property.bedrooms} bedroom${property.bedrooms !== 1 ? "s" : ""}`,
                },
                {
                  icon: <Bath size={22} />,
                  label: "Bathrooms",
                  val: `${property.bathrooms} bathroom${property.bathrooms !== 1 ? "s" : ""}`,
                },
                {
                  icon: <Star size={22} />,
                  label: "Rating",
                  val:
                    property.totalReviews > 0
                      ? `${property.averageRating.toFixed(1)} / 5`
                      : "New listing",
                },
              ].map(({ icon, label, val }) => (
                <div
                  key={label}
                  className="group text-center py-5 px-4 rounded-2xl border border-slate-100 hover:border-[#1E5FBE]/30 hover:bg-[#F8FAFF] transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF2FF] group-hover:bg-[#1E5FBE] flex items-center justify-center mx-auto mb-3 text-[#1E5FBE] group-hover:text-white transition-all duration-300">
                    {icon}
                  </div>
                  <div className="font-semibold text-[#0B1F3A] text-sm">
                    {val}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                  About
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-5">
                About this Keyneet
              </h2>
              <div className="text-slate-600 leading-[1.85] text-[15px] whitespace-pre-line">
                {property.description || property.summary}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                    Amenities
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-6">
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenityList.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:border-[#1E5FBE]/20 hover:bg-[#F8FAFF] transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] group-hover:bg-[#1E5FBE] flex items-center justify-center text-[#1E5FBE] group-hover:text-white transition-all duration-200 shrink-0">
                        {AMENITY_ICONS[a] || <Check size={16} />}
                      </div>
                      <span className="text-[#0B1F3A] font-medium text-sm">
                        {a}
                      </span>
                    </div>
                  ))}
                </div>
                {property.amenities.length > 10 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-5 text-sm font-medium text-[#1E5FBE] border border-[#1E5FBE]/30 hover:bg-[#EBF2FF] px-5 py-2.5 rounded-xl transition-all"
                  >
                    {showAll
                      ? "Show fewer amenities"
                      : `Show all ${property.amenities.length} amenities`}
                  </button>
                )}
              </div>
            )}

            {/* Discounts */}
            {property.discounts?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                    Savings
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-6">
                  Stay longer, save more
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.discounts.map((d) => (
                    <div
                      key={d.label}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-135 from-[#0B1F3A] to-[#1E5FBE] p-6 text-white"
                    >
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full" />
                      <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-[#C9A84C]/10 rounded-full" />
                      <div className="relative z-10">
                        <div className="font-display text-5xl font-bold text-[#C9A84C] mb-1">
                          {d.percentage}%
                        </div>
                        <div className="text-white font-semibold">
                          {d.label}
                        </div>
                        <div className="text-white/60 text-sm mt-1">
                          {d.minNights}+ nights required
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House rules */}
            {property.rules?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                    Rules
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-6">
                  House rules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.rules.map((r) => (
                    <div
                      key={r}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#1E5FBE]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} className="text-[#1E5FBE]" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">
                        {r}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact host */}
            <div className="rounded-3xl bg-gradient-to-br from-[#0B1F3A] to-[#163669] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#C9A84C] flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
                    B
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Boobo London</div>
                    <div className="text-white/60 text-sm">
                      Host · Bermstone
                    </div>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Questions about the property? We typically respond within the
                  hour.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/212600359326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-white font-medium px-5 py-3 rounded-xl transition-all text-sm shadow-md"
                  >
                    <Phone size={15} />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-5 py-3 rounded-xl transition-all text-sm"
                  >
                    <Mail size={15} />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Booking widget ───────────────────────── */}
          <div>
            <div className="sticky top-28">
              <BookingWidget property={property} />

              {/* Back to listings */}
              <Link
                href="/keyneet"
                className="flex items-center justify-center gap-2 mt-4 text-slate-500 hover:text-[#1E5FBE] text-sm transition-colors py-2"
              >
                <ChevronLeft size={14} />
                Back to all keyneet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        context={{ type: "property", name: property.name }}
      />

      {lightbox && (
        <Lightbox
          images={imgs}
          index={imgIdx}
          onClose={() => setLightbox(false)}
          onChange={setImgIdx}
        />
      )}
    </div>
  );
}
