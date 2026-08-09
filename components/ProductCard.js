"use client";

import Link from "next/link";
import SafeImage from "./SafeImage";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const img = product.images?.[0];
  const alt = product.images?.[1] || img;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand lift">
          <SafeImage
            src={img}
            alt={product.name}
            label={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <SafeImage
            src={alt}
            alt={product.name}
            label={product.name}
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
          />
          {discount > 0 ? (
            <span className="absolute top-3 left-3 bg-clay text-cream label px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          ) : product.featured ? (
            <span className="absolute top-3 left-3 bg-ink/85 text-cream label px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          ) : null}

          {/* quick add — slides up on hover (desktop), tappable on mobile */}
          <div className="absolute inset-x-3 bottom-3 md:translate-y-[130%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                add(product, 1);
              }}
              className="btn btn-primary w-full !py-3 shadow-soft"
            >
              Add to bag
            </button>
          </div>
        </div>
      </Link>
      <div className="pt-3">
        <Link
          href={`/products/${product.slug}`}
          className="text-[15px] font-medium leading-snug hover-underline"
        >
          {product.name}
        </Link>
        {product.material && (
          <p className="text-xs text-muted mt-0.5">{product.material}</p>
        )}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {discount > 0 && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
