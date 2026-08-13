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
  const rating = (product.rating || 4.6).toFixed(1);
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="group bg-white border border-line rounded-xl overflow-hidden flex flex-col transition hover:shadow-[0_14px_30px_-18px_rgba(35,39,51,0.45)] hover:border-forest/30">
      <div className="relative aspect-square bg-sand">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <SafeImage src={img} alt={product.name} label={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <span className="absolute top-2.5 left-2.5 bg-clay text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
          {badge || (discount > 0 ? `${discount}% OFF` : "Trending")}
        </span>
        <button onClick={() => setSaved((v) => !v)} aria-label="Save" className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow grid place-items-center text-ink hover:text-clay">
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-7.5-4.7-10-9.3C.6 8.9 2 5.5 5.2 5.1 7 4.9 8.6 5.9 12 8.5c3.4-2.6 5-3.6 6.8-3.4 3.2.4 4.6 3.8 3.2 6.6C19.5 16.3 12 21 12 21z" /></svg>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`} className="text-sm font-medium text-ink leading-snug line-clamp-2 hover:text-forest min-h-[2.5em]">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5 bg-teal/10 text-teal text-[11px] font-semibold px-1.5 py-0.5 rounded">{rating} ★</span>
          {product.category?.name && <span className="text-[11px] text-muted truncate">{product.category.name}</span>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink">{formatPrice(product.price)}</span>
          {discount > 0 && <span className="text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <div className="text-[11px] text-teal font-medium">Get Best Price</div>

        <div className="mt-3 flex flex-col sm:flex-row gap-2 mt-auto pt-3">
          <button onClick={() => add(product, 1)} className="btn btn-primary flex-1 !py-2 !text-xs !px-2">Add to Cart</button>
          <Link href={`/products/${product.slug}`} className="btn btn-blue flex-1 !py-2 !text-xs !px-2 whitespace-nowrap">Details</Link>
        </div>
      </div>
    </div>
  );
}
