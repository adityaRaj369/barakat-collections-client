"use client";

import Link from "next/link";
import { useRef } from "react";
import SafeImage from "./SafeImage";
import Magnetic from "./Magnetic";

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const HEAD = ["Handcrafted", "living,", "made", "to", "move", "you."];

export default function HeroCinematic() {
  const layers = useRef([]);
  const set = (i) => (el) => (layers.current[i] = el);

  function move(e) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    layers.current.forEach((el) => {
      if (!el) return;
      const d = Number(el.dataset.depth || 10);
      el.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
    });
  }
  function reset() {
    layers.current.forEach((el) => {
      if (el) el.style.transform = "translate3d(0,0,0)";
    });
  }

  return (
    <section
      onMouseMove={move}
      onMouseLeave={reset}
      className="relative overflow-hidden bg-espresso text-cream"
    >
      {/* local glows */}
      <div
        ref={set(0)}
        data-depth="18"
        className="pointer-events-none absolute -top-40 -left-32 w-[46vw] h-[46vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(202,162,74,0.45),transparent 60%)" }}
      />
      <div
        ref={set(1)}
        data-depth="-24"
        className="pointer-events-none absolute top-24 -right-32 w-[42vw] h-[42vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(217,131,99,0.4),transparent 60%)" }}
      />

      <div className="relative container-x grid lg:grid-cols-2 gap-10 items-center min-h-[92vh] py-24">
        {/* copy */}
        <div>
          <span className="inline-flex items-center gap-2 label text-goldSoft">
            <span className="w-6 h-px bg-gold" /> New season · 2026
          </span>
          <h1 className="font-serif font-semibold h-hero mt-5">
            {HEAD.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
                <span
                  className="inline-block animate-fadeUp"
                  style={{ animationDelay: `${120 + i * 90}ms`, opacity: 0 }}
                >
                  {w === "living," ? (
                    <span className="italic text-gradient">living,</span>
                  ) : (
                    w
                  )}
                </span>
              </span>
            ))}
          </h1>
          <p
            className="mt-6 text-cream/75 text-lg max-w-md animate-fadeUp"
            style={{ animationDelay: "760ms", opacity: 0 }}
          >
            Vases, lamps and textiles — each piece made by hand by Indian
            artisans, chosen to bring warmth and story to your space.
          </p>
          <div
            className="mt-9 flex flex-wrap gap-3 animate-fadeUp"
            style={{ animationDelay: "860ms", opacity: 0 }}
          >
            <Magnetic>
              <Link href="/products" className="btn btn-primary">
                Shop the collection
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="#categories"
                className="btn glass text-cream hover:bg-white/15"
              >
                Browse categories
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* floating image stack */}
        <div className="relative h-[60vh] min-h-[420px] hidden md:block">
          <div
            ref={set(2)}
            data-depth="26"
            className="absolute inset-0 rounded-4xl overflow-hidden media-zoom soft"
          >
            <SafeImage
              src={img("photo-1616486338812-3dadae4b4ace")}
              alt="Handcrafted living room"
              label="BARAKAT COLLECTIONS"
              className="w-full h-full object-cover animate-kenburns"
            />
          </div>
          <div
            ref={set(3)}
            data-depth="48"
            className="absolute -left-10 bottom-10 w-44 rounded-3xl overflow-hidden ring-warm bg-espresso"
          >
            <div className="aspect-[3/4] media-zoom">
              <SafeImage src={img("photo-1578500494198-246f612d3b3d")} alt="Vase" label="Vase" className="w-full h-full object-cover" />
            </div>
          </div>
          <div
            ref={set(4)}
            data-depth="64"
            className="absolute -right-6 top-8 glass rounded-2xl px-4 py-3"
          >
            <div className="text-gradient font-serif text-2xl font-semibold">4.8★</div>
            <div className="label text-cream/70">2,300+ homes</div>
          </div>
        </div>
      </div>

      {/* mobile hero image */}
      <div className="md:hidden container-x pb-14 -mt-8">
        <div className="rounded-4xl overflow-hidden soft media-zoom aspect-[4/3]">
          <SafeImage
            src={img("photo-1616486338812-3dadae4b4ace")}
            alt="Handcrafted living room"
            label="BARAKAT COLLECTIONS"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
