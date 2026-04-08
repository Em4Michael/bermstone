"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/types";
import PropertyCard from "@/components/properties/PropertyCard";
import { cn } from "@/lib/utils";

const AMENITIES = [
  "WiFi",
  "Pool",
  "Gym",
  "Parking",
  "Air Conditioning",
  "Kitchen",
  "Generator",
  "Security",
  "Balcony",
  "Sea View",
];
const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];
const CITIES = [
  "Marrakech",
  "Casablanca",
  "Rabat",
  "Fès",
  "Agadir",
  "Essaouira",
];

export default function keyneetClient() {
  const searchParams = useSearchParams();

  const [keyneet, setkeyneet] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShow] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    maxGuests: searchParams.get("maxGuests") || "",
    amenities: searchParams.get("amenities") || "",
    sortBy: searchParams.get("sortBy") || "",
    search: searchParams.get("search") || "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Build params — everything goes to the API, nothing filtered client-side
      const params: Record<string, string | number | boolean> = {
        page,
        limit: 50, // high limit so filters work across all data
      };

      if (filters.city) params.city = filters.city;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
      if (filters.maxGuests) params.maxGuests = Number(filters.maxGuests);
      if (filters.amenities) params.amenities = filters.amenities;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await propertiesApi.getAll(params as never);
      setkeyneet(res.data || []);
      setTotal(res.pagination?.total || 0);
      setPages(res.pagination?.pages || 1);
    } catch (e) {
      console.error("Failed to load keyneet:", e);
      setkeyneet([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key: string, val: string) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const toggleAmenity = (a: string) => {
    const list = filters.amenities ? filters.amenities.split(",") : [];
    const next = list.includes(a) ? list.filter((x) => x !== a) : [...list, a];
    set("amenities", next.join(","));
  };

  const clear = () => {
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      maxGuests: "",
      amenities: "",
      sortBy: "",
      search: "",
    });
    setPage(1);
  };

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Hero header */}
      <div className="relative bg-animated-gradient noise overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #C9A84C, transparent)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-0 left-20 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #3B9EE0, transparent)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-white/80 text-xs font-medium uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
              Keyneet Apartments
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
              Find Your Perfect <br />
              <span className="text-gradient-gold italic">Keyneet Stay</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl">
              {total > 0
                ? `${total} verified apartments across Morocco`
                : "Curated luxury apartments for every occasion"}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                value={filters.search}
                onChange={(e) => set("search", e.target.value)}
                placeholder="Search by name or city…"
                className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>

            {/* City */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 md:w-44">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <input
                value={filters.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="City"
                className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 min-w-[170px]">
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => set("sortBy", e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent cursor-pointer appearance-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* More filters toggle */}
            <button
              onClick={() => setShow(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                showFilters
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "border-slate-200 text-slate-700 hover:border-[#0B1F3A]",
              )}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActive && (
                <span className="w-2 h-2 bg-[#C9A84C] rounded-full" />
              )}
            </button>

            {hasActive && (
              <button
                onClick={clear}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-down">
              <div>
                <label className="form-label">Min Price (MAD )</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => set("minPrice", e.target.value)}
                  className="form-input text-sm"
                  placeholder="30,000"
                />
              </div>
              <div>
                <label className="form-label">Max Price (MAD )</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => set("maxPrice", e.target.value)}
                  className="form-input text-sm"
                  placeholder="250,000"
                />
              </div>
              <div>
                <label className="form-label">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Min Guests</label>
                <select
                  value={filters.maxGuests}
                  onChange={(e) => set("maxGuests", e.target.value)}
                  className="form-input text-sm"
                >
                  <option value="">Any</option>
                  {[1, 2, 4, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-4">
                <label className="form-label">Amenities</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {AMENITIES.map((a) => {
                    const active = filters.amenities
                      .split(",")
                      .filter(Boolean)
                      .includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                          active
                            ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                            : "border-slate-200 text-slate-600 hover:border-[#0B1F3A]",
                        )}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* City quick pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-slate-400 self-center mr-1">
            Browse by city:
          </span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => set("city", filters.city === c ? "" : c)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                filters.city === c
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "border-slate-200 text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-slate-400 mb-6">
            Showing <strong className="text-[#0B1F3A]">{keyneet.length}</strong>
            {total > keyneet.length && (
              <>
                {" "}
                of <strong className="text-[#0B1F3A]">{total}</strong>
              </>
            )}{" "}
            apartments
            {hasActive && <span className="text-[#1E5FBE]"> (filtered)</span>}
          </p>
        )}

        {/* ── Grid — NO reveal class, data shows immediately ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="shimmer" style={{ aspectRatio: "4/3" }} />
                <div className="p-5 space-y-3 bg-white rounded-b-3xl">
                  <div className="shimmer h-3 w-1/3 rounded-full" />
                  <div className="shimmer h-5 w-4/5 rounded-lg" />
                  <div className="shimmer h-3 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : keyneet.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-6xl mb-5 animate-float inline-block">🏘️</div>
            <h3 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-2">
              No apartments found
            </h3>
            <p className="text-slate-400 mb-6">
              {hasActive
                ? "Try adjusting your filters or clear them to see all apartments."
                : "No apartments available yet."}
            </p>
            {hasActive && (
              <button onClick={clear} className="btn-primary">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Cards render immediately — no opacity:0 / reveal class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {keyneet.map((p, i) => (
                <div
                  key={p._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
                >
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>

            {/* Pagination — only show when not filtering */}
            {pages > 1 && !hasActive && (
              <div className="flex justify-center gap-2 mt-14">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:border-[#0B1F3A] transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-10 h-10 text-sm rounded-xl border transition-all",
                      p === page
                        ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                        : "border-slate-200 hover:border-[#0B1F3A]",
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:border-[#0B1F3A] transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
