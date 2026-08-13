"use client";

import { useEffect, useState } from "react";

// Plays once per full page load. Hiding is driven by CSS (so it can never get
// "stuck" if a JS timer is delayed); JS just removes it from the DOM afterward.
let PLAYED = false;

export default function Preloader() {
  const [show, setShow] = useState(!PLAYED);

  useEffect(() => {
    if (PLAYED) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => {
      PLAYED = true;
      setShow(false);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div className="text-center px-6">
        <div className="overflow-hidden">
          <div className="clip-up">
            <span className="font-serif text-white text-4xl md:text-6xl font-bold tracking-tight">
              Barakat <span className="text-goldSoft">Collections</span>
            </span>
          </div>
        </div>
        <div className="overflow-hidden mt-2">
          <p className="clip-up label text-white/60" style={{ animationDelay: "160ms" }}>
            Artisan Marketplace
          </p>
        </div>
      </div>
      <div className="preloader__bar" />
    </div>
  );
}
