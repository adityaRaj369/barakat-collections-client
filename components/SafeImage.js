"use client";

import { useState } from "react";

// A never-gray image: if the given src is missing or fails, it falls back to
// a real deterministic photo (picsum) seeded by the alt/label — so the UI is
// always populated, never an empty gray box.
function fallbackFor(seedText) {
  const seed = encodeURIComponent((seedText || "barakat").slice(0, 40));
  return `https://picsum.photos/seed/${seed}/800/800`;
}

export default function SafeImage({ src, alt = "", className = "", label }) {
  const seedText = label || alt || "barakat";
  const [current, setCurrent] = useState(src || fallbackFor(seedText));
  const [triedFallback, setTriedFallback] = useState(!src);

  function onError() {
    if (!triedFallback) {
      setTriedFallback(true);
      setCurrent(fallbackFor(seedText));
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onError={onError}
      className={className}
    />
  );
}
