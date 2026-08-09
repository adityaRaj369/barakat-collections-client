"use client";

import { useState } from "react";

// Plain <img> with a warm fallback so the UI stays intact if a remote
// image fails to load.
export default function SafeImage({ src, alt = "", className = "", label }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-sand text-muted ${className}`}
      >
        <span className="label px-3 text-center">{label || alt || "BARAKAT COLLECTIONS"}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
