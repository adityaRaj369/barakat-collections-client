"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SafeImage from "./SafeImage";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/format";

export default function ProductDetail({ product, related }) {
  const { add } = useCart();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const images = product.images?.length ? product.images : [null];

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  function buyNow() {
    add(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="container-x py-8 md:py-12">
      <nav className="label text-muted mb-6 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-ink"
            >
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* gallery */}
        <div className="flex gap-4">
          {images.length > 1 && (
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`aspect-square rounded-xl overflow-hidden border ${
                    active === i ? "border-clay" : "border-line"
                  }`}
                >
                  <SafeImage src={src} alt="" label={product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="flex-1">
            <div className="aspect-square rounded-3xl overflow-hidden bg-sand">
              <SafeImage
                src={images[active]}
                alt={product.name}
                label={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* details */}
        <div className="md:pt-2">
          {product.category && (
            <span className="label text-clay">{product.category.name}</span>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-2">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-medium">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="label text-clay">-{discount}%</span>
              </>
            )}
          </div>
          <p className="text-sm text-muted mt-1">Incl. of all taxes</p>

          <p className="mt-6 text-ink/80 leading-relaxed">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
            {product.material && (
              <>
                <dt className="text-muted">Material</dt>
                <dd>{product.material}</dd>
              </>
            )}
            {product.artisan && (
              <>
                <dt className="text-muted">Artisan</dt>
                <dd>{product.artisan}</dd>
              </>
            )}
            {product.origin && (
              <>
                <dt className="text-muted">Origin</dt>
                <dd>{product.origin}</dd>
              </>
            )}
            <dt className="text-muted">Availability</dt>
            <dd className={product.stock > 0 ? "text-olive" : "text-clay"}>
              {product.stock > 0 ? `In stock (${product.stock})` : "Sold out"}
            </dd>
          </dl>

          {/* qty + actions */}
          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border border-line rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 text-lg"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 20, q + 1))}
                className="w-10 h-10 text-lg"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <span className="text-sm text-muted">
              Subtotal {formatPrice(product.price * qty)}
            </span>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => add(product, qty)}
              disabled={product.stock <= 0}
              className="btn btn-outline flex-1"
            >
              Add to bag
            </button>
            <button
              onClick={buyNow}
              disabled={product.stock <= 0}
              className="btn btn-primary flex-1"
            >
              Buy now
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span>✓ Handmade &amp; unique</span>
            <span>✓ Free shipping over ₹1,499</span>
            <span>✓ 7-day easy returns</span>
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-9 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
