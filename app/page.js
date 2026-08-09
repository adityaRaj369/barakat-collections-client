import Link from "next/link";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Reveal from "@/components/Reveal";
import StatementMarquee from "@/components/StatementMarquee";
import HeroCinematic from "@/components/HeroCinematic";
import Counter from "@/components/Counter";

export const dynamic = "force-dynamic";

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

// Static fallbacks so the landing page always looks full — even before
// `npm run db:seed` has run.
const FALLBACK_CATS = [
  { name: "Vases & Planters", slug: "vases-planters", image: img("photo-1578500494198-246f612d3b3d") },
  { name: "Lighting", slug: "lighting", image: img("photo-1513506003901-1e6a229e2d15") },
  { name: "Wall Décor", slug: "wall-decor", image: img("photo-1533090161767-e6ffed986c88") },
  { name: "Textiles & Cushions", slug: "textiles-cushions", image: img("photo-1584100936595-c0654b55a2e6") },
  { name: "Tableware", slug: "tableware", image: img("photo-1603199506016-b9a594b593c0") },
  { name: "Décor Accents", slug: "decor-accents", image: img("photo-1600166898405-da9535204843") },
];

async function getData() {
  try {
    const [featured, categories] = await Promise.all([
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    return { featured: featured.map(serializeProduct), categories };
  } catch {
    return { featured: [], categories: [] };
  }
}

export default async function HomePage() {
  const { featured, categories } = await getData();
  const cats = categories.length ? categories : FALLBACK_CATS;

  return (
    <div className="overflow-x-hidden">
      <HeroCinematic />

      <StatementMarquee />

      {/* ============ CATEGORIES (bento) ============ */}
      <section id="categories" className="container-x py-14 md:py-24">
        <Reveal className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="label text-clay">Explore</span>
            <h2 className="font-serif font-semibold h-section mt-1">
              Shop by category
            </h2>
          </div>
          <Link href="/products" className="hidden md:inline text-sm hover-underline">
            View all →
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[230px]">
          {cats.slice(0, 6).map((c, i) => {
            // first tile is large (bento asymmetry)
            const big = i === 0;
            return (
              <Reveal
                key={c.slug}
                delay={(i % 4) * 70}
                className={big ? "col-span-2 row-span-2" : ""}
              >
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative block w-full h-full rounded-3xl overflow-hidden bg-sand lift"
                >
                  <div className="media-zoom absolute inset-0">
                    <SafeImage
                      src={c.image}
                      alt={c.name}
                      label={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-6">
                    <h3
                      className={`font-serif text-cream font-semibold ${
                        big ? "text-2xl md:text-4xl" : "text-lg md:text-2xl"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <span className="label text-cream/85">Shop now →</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ SHOP THE ROOM ============ */}
      <section className="container-x pb-14 md:pb-24">
        <Reveal className="relative rounded-4xl overflow-hidden soft">
          <div className="media-zoom aspect-[16/10] md:aspect-[21/9]">
            <SafeImage
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1900&q=80"
              alt="Styled living space"
              label="Shop the room"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" />

          {/* interactive hotspots (hover to reveal) */}
          <Hotspot top="38%" left="24%" label="Handwoven throw" />
          <Hotspot top="62%" left="52%" label="Terracotta vase" />
          <Hotspot top="30%" left="72%" label="Brass table lamp" />

          <div className="absolute top-6 left-6 md:top-10 md:left-10 max-w-sm">
            <span className="label text-cream/80">Get the look</span>
            <h2 className="font-serif text-cream font-semibold text-3xl md:text-5xl mt-2">
              Shop the room
            </h2>
            <p className="text-cream/85 mt-3 hidden md:block">
              Tap the dots to explore every handcrafted piece in this space.
            </p>
            <Link href="/products" className="btn bg-cream text-ink hover:bg-cream/90 mt-5">
              Explore the edit
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============ BESTSELLERS ============ */}
      <section className="container-x pb-14 md:pb-24">
        <Reveal className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="label text-clay">Most loved</span>
            <h2 className="font-serif font-semibold h-section mt-1">Bestsellers</h2>
          </div>
          <Link href="/products" className="hidden md:inline text-sm hover-underline">
            See all →
          </Link>
        </Reveal>

        {featured.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          // rich fallback so the page never looks empty before seeding
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {FALLBACK_CATS.slice(0, 4).map((c, i) => (
              <Reveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group relative block aspect-[4/5] rounded-3xl overflow-hidden bg-sand lift"
                >
                  <div className="media-zoom absolute inset-0">
                    <SafeImage src={c.image} alt={c.name} label={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-serif text-cream text-lg md:text-xl font-semibold">{c.name}</h3>
                    <span className="label text-cream/80">Shop →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ============ VALUES ============ */}
      <section className="container-x pb-14 md:pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            ["✶", "Handmade", "Every piece shaped by human hands."],
            ["❋", "Fair trade", "Artisans paid fairly, always."],
            ["✦", "Free shipping", "On orders over ₹1,499."],
            ["↺", "Easy returns", "7-day, no-questions returns."],
          ].map(([icon, t, s], i) => (
            <Reveal key={t} delay={i * 60}>
              <div className="card p-6 h-full lift">
                <div className="text-2xl text-clay">{icon}</div>
                <h3 className="font-serif text-lg font-semibold mt-3">{t}</h3>
                <p className="text-sm text-muted mt-1">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="bg-sand/60 border-y border-line">
        <div className="container-x py-14 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal className="relative">
            <div className="aspect-[5/6] rounded-4xl overflow-hidden media-zoom soft">
              <SafeImage
                src={img("photo-1528465424850-54d22f092f9d")}
                alt="Artisan at work"
                label="Our artisans"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-6 -right-6 card p-5 ring-warm">
              <div className="font-serif text-3xl">120+</div>
              <div className="text-xs text-muted">artisan partners</div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="label text-clay">Our promise</span>
            <h2 className="font-serif font-semibold h-section mt-2">
              Made by hand, made to last
            </h2>
            <p className="mt-4 text-ink/70 leading-relaxed text-lg">
              We work directly with craft clusters across India — from the blue
              potters of Jaipur to the weavers of Kutch — celebrating techniques
              passed down for generations. Every BARAKAT COLLECTIONS piece keeps a craft
              alive.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 text-center">
              {[
                [120, "+", "Artisan partners"],
                [100, "%", "Handmade"],
                [15, "k+", "Happy homes"],
              ].map(([n, suf, label]) => (
                <div key={label} className="card p-4 lift">
                  <div className="font-serif text-2xl md:text-3xl">
                    <Counter to={n} suffix={suf} />
                  </div>
                  <div className="text-xs text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>
            <Link href="/products" className="btn btn-primary mt-8">
              Discover the craft
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="container-x py-14 md:py-24">
        <Reveal>
          <h2 className="font-serif font-semibold h-section text-center">
            Homes that love BARAKAT COLLECTIONS
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            ["The terracotta vases are even more beautiful in person. You can feel the hand that made them.", "Ananya, Bengaluru"],
            ["My living room finally feels like a home. The cane lamp is a showstopper.", "Rahul, Mumbai"],
            ["Fast delivery, gorgeous packaging, and every piece feels special. My go-to for gifting.", "Meera, Delhi"],
          ].map(([quote, name], i) => (
            <Reveal key={name} delay={i * 90}>
              <figure className="card p-7 h-full lift">
                <div className="text-clay">★★★★★</div>
                <blockquote className="mt-4 text-ink/80 leading-relaxed">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-5 label text-muted">{name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="container-x pb-16 md:pb-24">
        <Reveal className="relative overflow-hidden rounded-4xl bg-ink text-cream px-6 md:px-16 py-14 md:py-20 text-center">
          <div className="absolute -top-16 -right-10 w-64 h-64 blob bg-clay/40 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 blob-2 bg-terracotta/30 blur-2xl" />
          <div className="relative">
            <span className="label text-cream/70">Join the circle</span>
            <h2 className="font-serif font-semibold text-3xl md:text-5xl mt-3">
              Get 10% off your first find
            </h2>
            <p className="text-cream/75 mt-3 max-w-md mx-auto">
              New drops, artisan stories and members-only offers — straight to
              your inbox.
            </p>
            <form className="mt-7 max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 input !bg-cream/10 !border-cream/30 !text-cream placeholder:!text-cream/50"
              />
              <button type="button" className="btn bg-cream text-ink hover:bg-cream/90">
                Join
              </button>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Hotspot({ top, left, label }) {
  return (
    <div className="group absolute" style={{ top, left }}>
      <span className="hotspot">+</span>
      <span className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-cream text-ink text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-soft">
        {label}
      </span>
    </div>
  );
}
