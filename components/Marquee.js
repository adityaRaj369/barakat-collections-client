"use client";

const items = [
  "Handmade in India",
  "Fair-trade artisans",
  "Ethically sourced",
  "Free shipping over ₹1,499",
  "7-day easy returns",
];

export default function Marquee() {
  const loop = [...items, ...items, ...items];
  return (
    <div className="bg-ink text-cream overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((t, i) => (
          <span key={i} className="label text-cream/85 flex items-center">
            <span className="mx-6">{t}</span>
            <span className="text-terracotta">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
