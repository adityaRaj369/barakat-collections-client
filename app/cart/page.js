"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import SafeImage from "@/components/SafeImage";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, hydrated, setQty, remove, subtotal, clear } = useCart();
  const shipping = subtotal >= 149900 || subtotal === 0 ? 0 : 9900;
  const total = subtotal + shipping;

  if (!hydrated) {
    return <div className="container-x py-24 text-center text-muted">Loading bag…</div>;
  }

  if (!items.length) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          Your bag is empty
        </h1>
        <p className="text-muted mt-3">Discover something handmade.</p>
        <Link href="/products" className="btn btn-primary mt-8 inline-flex">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      <div className="flex items-end justify-between mb-8">
        <h1 className="font-serif text-3xl md:text-5xl font-semibold">
          Shopping Bag
        </h1>
        <button onClick={clear} className="text-sm text-muted hover:text-ink">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="divide-y divide-line border-y border-line">
          {items.map((it) => (
            <div key={it.id} className="flex gap-4 py-5">
              <Link
                href={`/products/${it.slug}`}
                className="w-24 h-28 rounded-xl overflow-hidden bg-sand shrink-0"
              >
                <SafeImage src={it.image} alt={it.name} label={it.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${it.slug}`} className="font-medium hover-underline">
                    {it.name}
                  </Link>
                  <span className="tabular-nums">{formatPrice(it.price * it.quantity)}</span>
                </div>
                <p className="text-sm text-muted mt-1">{formatPrice(it.price)} each</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center border border-line rounded-full">
                    <button onClick={() => setQty(it.id, it.quantity - 1)} className="w-9 h-9" aria-label="Decrease">−</button>
                    <span className="w-8 text-center tabular-nums text-sm">{it.quantity}</span>
                    <button onClick={() => setQty(it.id, it.quantity + 1)} className="w-9 h-9" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(it.id)} className="text-sm text-muted hover:text-ink">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          <div className="card p-6">
            <h2 className="label mb-4">Order Summary</h2>
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
            {subtotal > 0 && subtotal < 149900 && (
              <p className="text-xs text-muted mt-1">
                Add {formatPrice(149900 - subtotal)} more for free shipping
              </p>
            )}
            <div className="border-t border-line mt-4 pt-4 flex justify-between font-medium text-lg">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full mt-6">
              Checkout
            </Link>
            <Link href="/products" className="block text-center text-sm mt-3 hover-underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
