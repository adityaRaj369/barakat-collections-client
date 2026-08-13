"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/format";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, clear, hydrated } = useCart();
  const [addr, setAddr] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // { orderId, demo }

  useEffect(() => {
    if (session?.user) {
      setAddr((a) => ({
        ...a,
        fullName: a.fullName || session.user.name || "",
        email: a.email || session.user.email || "",
      }));
    }
  }, [session]);

  const shipping = subtotal >= 149900 || subtotal === 0 ? 0 : 9900;
  const total = subtotal + shipping;
  const set = (k) => (e) => setAddr((a) => ({ ...a, [k]: e.target.value }));

  const canPay = useMemo(
    () =>
      addr.fullName &&
      addr.email &&
      addr.phone &&
      addr.line1 &&
      addr.city &&
      addr.state &&
      addr.pincode &&
      items.length > 0,
    [addr, items]
  );

  async function verify(payload) {
    const res = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  }

  async function pay() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addr,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed.");
        setLoading(false);
        return;
      }

      if (data.demo) {
        const ok = await verify({ orderId: data.orderId });
        if (ok) {
          setDone({ orderId: data.orderId, demo: true });
          clear();
        } else setError("Could not confirm the demo order.");
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Could not load the payment window. Check your connection.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "BARAKAT COLLECTIONS",
        description: "Handcrafted order",
        prefill: data.prefill,
        theme: { color: "#c1614a" },
        handler: async (resp) => {
          const ok = await verify({
            orderId: data.orderId,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
          if (ok) {
            setDone({ orderId: data.orderId, demo: false });
            clear();
          } else {
            setError("Payment could not be verified.");
          }
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="container-x py-20 md:py-28 max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-olive text-cream flex items-center justify-center text-3xl">
          ✓
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-6">
          Order confirmed
        </h1>
        <p className="text-muted mt-3">
          Thank you! Your order{" "}
          <span className="font-mono">#{done.orderId.slice(-8).toUpperCase()}</span>{" "}
          has been placed{done.demo ? " (demo — no payment was taken)" : ""}.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account" className="btn btn-primary">
            View my orders
          </Link>
          <Link href="/products" className="btn btn-outline">
            Keep shopping
          </Link>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Your bag is empty</h1>
        <Link href="/products" className="btn btn-primary mt-6 inline-flex">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* address */}
        <div>
          <h2 className="label text-muted mb-4">Shipping details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" value={addr.fullName} onChange={set("fullName")} />
            <Field label="Email" type="email" value={addr.email} onChange={set("email")} />
            <Field label="Phone" value={addr.phone} onChange={set("phone")} />
            <Field label="Pincode" value={addr.pincode} onChange={set("pincode")} />
            <div className="sm:col-span-2">
              <Field label="Address line 1" value={addr.line1} onChange={set("line1")} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Address line 2 (optional)" value={addr.line2} onChange={set("line2")} />
            </div>
            <Field label="City" value={addr.city} onChange={set("city")} />
            <Field label="State" value={addr.state} onChange={set("state")} />
          </div>
          {error && <p className="text-clay text-sm mt-4">{error}</p>}
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="card p-6">
            <h2 className="label mb-4">Your order</h2>
            <ul className="space-y-2 mb-4 max-h-64 overflow-auto">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span className="text-ink/80 truncate mr-2">
                    {it.quantity} × {it.name}
                  </span>
                  <span className="tabular-nums">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="tabular-nums">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={pay}
              disabled={!canPay || loading}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? "Processing…" : `Pay ${formatPrice(total)}`}
            </button>
            <p className="text-xs text-muted text-center mt-3">
              Secure checkout — payments protected by Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="label text-muted block mb-1.5">{label}</span>
      <input type={type} className="input" value={value} onChange={onChange} />
    </label>
  );
}
