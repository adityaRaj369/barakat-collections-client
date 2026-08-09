"use client";

export default function StatementMarquee({
  words = ["Handcrafted", "Artisan-made", "Ethically sourced", "One of a kind"],
}) {
  const loop = [...words, ...words, ...words];
  return (
    <section className="overflow-hidden py-6 md:py-9 bg-espresso border-y border-white/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {loop.map((w, i) => (
          <span
            key={i}
            className="font-serif italic h-mega mx-6 md:mx-10 flex items-center gap-6 md:gap-10 text-gradient"
          >
            {w}
            <span className="not-italic text-gold/60 text-[0.4em]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
