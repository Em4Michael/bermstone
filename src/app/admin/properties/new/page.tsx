"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const AMENITY_LIST = [
  "WiFi",
  "Pool",
  "Gym",
  "Parking",
  "Air Conditioning",
  "Kitchen",
  "Washer",
  "TV",
  "Balcony",
  "Sea View",
  "Generator",
  "Security",
  "Elevator",
  "Garden",
];

interface FormData {
  name: string;
  summary: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rules: { value: string }[];
  images: { url: string; caption: string }[];
  bookingLink: string;
  isFeatured: boolean;
  isActive: boolean;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, control, watch, setValue } =
    useForm<FormData>({
      defaultValues: {
        country: "Morocco",
        currency: "MAD",
        isFeatured: false,
        isActive: true,
        amenities: [],
        rules: [{ value: "No smoking" }],
        images: [{ url: "", caption: "" }],
      },
    });

  const {
    fields: ruleFields,
    append: addRule,
    remove: removeRule,
  } = useFieldArray({ control, name: "rules" });
  const {
    fields: imageFields,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const selectedAmenities = watch("amenities") || [];
  const toggleAmenity = (a: string) => {
    const cur = watch("amenities") || [];
    setValue(
      "amenities",
      cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a],
    );
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const validImages = data.images.filter((img) => img.url.trim());

      await api.post("/properties", {
        name: data.name,
        summary: data.summary,
        description: data.description,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
        },
        pricePerNight: Number(data.pricePerNight),
        currency: data.currency,
        maxGuests: Number(data.maxGuests),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        amenities: data.amenities || [],
        rules: data.rules.map((r) => r.value).filter(Boolean),
        images: validImages,
        coverImage: validImages[0]?.url || "",
        bookingLink: data.bookingLink || "",
        isFeatured: Boolean(data.isFeatured),
        isActive: Boolean(data.isActive),
      });

      setDone(true);
      setTimeout(() => router.push("/admin/properties"), 1500);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create property",
      );
    } finally {
      setSaving(false);
    }
  };

  if (done)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle size={52} className="text-green-500 mx-auto mb-3" />
          <h2 className="font-display text-xl font-semibold text-[#0B1F3A]">
            Property Created!
          </h2>
          <p className="text-slate-500 text-sm mt-1">Redirecting…</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/properties"
          className="text-slate-400 hover:text-[#1E5FBE] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">
            Add New Property
          </h1>
          <p className="text-slate-500 text-sm">
            Fill in the details to list a new keyneet.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Basic Information
          </h2>
          <div>
            <label className="form-label">Property Name *</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="form-input"
              placeholder="e.g. Riad Al Andalus"
            />
          </div>
          <div>
            <label className="form-label">
              Short Summary *{" "}
              <span className="text-slate-400 font-normal text-xs">
                (max 300 chars — shown on listing cards)
              </span>
            </label>
            <textarea
              {...register("summary", {
                required: "Summary is required",
                maxLength: 300,
              })}
              rows={2}
              className="form-input resize-none"
            />
          </div>
          <div>
            <label className="form-label">Full Description *</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={5}
              className="form-input resize-none"
            />
          </div>
        </section>

        {/* Location */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Location
          </h2>
          <div>
            <label className="form-label">Full Address *</label>
            <input
              {...register("address", { required: "Address is required" })}
              className="form-input"
              placeholder="e.g. Rue Bab Doukkala, Medina"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">City *</label>
              <input
                {...register("city", { required: true })}
                className="form-input"
                placeholder="Marrakech"
              />
            </div>
            <div>
              <label className="form-label">State *</label>
              <input
                {...register("state", { required: true })}
                className="form-input"
                placeholder="Marrakech-Safi"
              />
            </div>
            <div>
              <label className="form-label">Country</label>
              <input {...register("country")} className="form-input" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Pricing & Capacity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Price Per Night *</label>
              <input
                type="number"
                min={0}
                {...register("pricePerNight", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
                className="form-input"
                placeholder="2500"
              />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select {...register("currency")} className="form-input">
                <option value="MAD">MAD (MAD )</option>
                <option value="MAD">MAD (د.م.)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Max Guests *</label>
              <input
                type="number"
                min={1}
                {...register("maxGuests", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Bedrooms *</label>
              <input
                type="number"
                min={0}
                {...register("bedrooms", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Bathrooms *</label>
              <input
                type="number"
                min={0}
                {...register("bathrooms", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((a) => {
              const active = selectedAmenities.includes(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    active
                      ? "bg-[#1E5FBE] text-white border-[#1E5FBE]"
                      : "border-slate-200 text-slate-600 hover:border-[#1E5FBE]"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </section>

        {/* Rules */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            House Rules
          </h2>
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
            onClick={() => addRule({ value: "" })}
            className="flex items-center gap-1.5 text-sm text-[#1E5FBE] hover:underline"
          >
            <Plus size={14} />
            Add Rule
          </button>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Images
            <span className="text-slate-400 font-normal text-sm ml-2">
              (first image = cover photo)
            </span>
          </h2>
          {imageFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              {i === 0 && (
                <span className="text-[10px] font-bold text-[#C9A84C] uppercase shrink-0">
                  Cover
                </span>
              )}
              {i > 0 && (
                <span className="text-[10px] text-slate-300 shrink-0 w-9 text-right">
                  {i + 1}
                </span>
              )}
              <input
                {...register(`images.${i}.url`)}
                className="form-input flex-1 text-sm"
                placeholder="https://…image url…"
              />
              <input
                {...register(`images.${i}.caption`)}
                className="form-input w-32 text-sm"
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
          ))}
          <button
            type="button"
            onClick={() => addImage({ url: "", caption: "" })}
            className="flex items-center gap-1.5 text-sm text-[#1E5FBE] hover:underline"
          >
            <Plus size={14} />
            Add Image
          </button>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-[#0B1F3A] border-b border-slate-100 pb-3">
            Settings
          </h2>
          <div>
            <label className="form-label">Booking / WhatsApp Link</label>
            <input
              {...register("bookingLink")}
              className="form-input"
              placeholder="https://wa.me/234…"
            />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-slate-300 text-[#1E5FBE]"
              />
              <span className="text-sm text-slate-700">
                Active (visible on site)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="rounded border-slate-300 text-[#1E5FBE]"
              />
              <span className="text-sm text-slate-700">
                Featured on homepage
              </span>
            </label>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pb-8">
          <Link href="/admin/properties" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating…
              </>
            ) : (
              "Create Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
