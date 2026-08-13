"use client";

import Link from "next/link";
import { useState } from "react";
import SafeImage from "./SafeImage";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product, badge }) {
  const { add } = useCart();
  const [saved, setSaved] = useState(false);
  const img = product.images?.[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="group bg-white border border-line rounded-2xl overflow-hidden flex flex-col transition hover:shadow-[0_16px_34px_-20px_rgba(32,32,28,0.4)]">
      <div className="relative aspect-square bg-sand">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <SafeImage
            src={img}
            alt={product.name}
            label={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span className="absolute top-2.5 left-2.5 bg-ink text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
          {badge || (discount > 0 ? `${discount}% OFF` : "New")}
        </span>
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label="Save"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow grid place-items-center text-ink hover:text-clay"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
            <path d="M12 21s-7.5-4.7-10-9.3C.6 8.9 2 5.5 5.2 5.1 7 4.9 8.6 5.9 12 8.5c3.4-2.6 5-3.6 6.8-3.4 3.2.4 4.6 3.8 3.2 6.6C19.5 16.3 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="p-3 flex items-end justify-between gap-2 flex-1">
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="block text-sm font-medium text-ink leading-snug line-clamp-1 hover:text-clay"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => add(product, 1)}
          aria-label="Add to cart"
          className="shrink-0 w-9 h-9 rounded-lg border border-line grid place-items-center text-ink hover:bg-clay hover:text-white hover:border-clay transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
