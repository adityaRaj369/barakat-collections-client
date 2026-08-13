import Link from "next/link";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from "@/lib/demoData";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [featured, latest, categories] = await Promise.all([
      prisma.product.findMany({ where: { featured: true }, include: { category: true }, take: 10, orderBy: { createdAt: "desc" } }),
      prisma.product.findMany({ include: { category: true }, take: 40, orderBy: { createdAt: "desc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    const f = featured.map(serializeProduct);
    const l = latest.map(serializeProduct);
    return {
      featured: f.length ? f : DEMO_PRODUCTS.filter((p) => p.featured),
      latest: l.length ? l : DEMO_PRODUCTS,
      categories: categories.length ? categories : DEMO_CATEGORIES,
    };
  } catch {
    return { featured: DEMO_PRODUCTS.filter((p) => p.featured), latest: DEMO_PRODUCTS, categories: DEMO_CATEGORIES };
  }
}

const POPULAR = ["Terracotta Vases", "Brass Lamps", "Wall Hangings", "Cushion Covers", "Dinner Sets", "Storage Baskets"];

export default async function HomePage() {
  const { featured, latest, categories } = await getData();
  const trending = (featured.length ? featured : latest).slice(0, 5);
  const collection = latest.slice(0, 20);
  const catCount = (slug) => latest.filter((p) => p.categorySlug === slug).length;

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-forest to-forestDark text-white">
        <div className="container-x py-8 md:py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <span className="inline-block bg-white/12 text-white/90 text-[11px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
              Handcrafted décor marketplace
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mt-4">
              Buy handmade décor,
              <br className="hidden sm:block" /> direct from <span className="text-goldSoft">artisans</span>.
            </h1>
            <p className="text-white/70 mt-3 max-w-lg">
              Vases, lighting, textiles, tableware and more — hundreds of handcrafted products at honest prices.
            </p>
            <form action="/products" className="mt-5 flex items-stretch bg-white rounded-lg overflow-hidden max-w-xl border-2 border-white/20">
              <input name="q" placeholder="What are you looking for?" className="flex-1 px-4 text-ink outline-none text-sm" />
              <button type="submit" className="bg-clay text-white px-6 text-sm font-semibold hover:bg-clayDark">Search</button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-white/50 text-sm mr-1">Popular:</span>
              {POPULAR.map((p) => (
                <Link key={p} href={`/products?q=${encodeURIComponent(p)}`} className="text-xs border border-white/25 hover:border-white/60 px-3 py-1.5 rounded-full transition">{p}</Link>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {[["42", "Products"], ["6", "Categories"], ["120+", "Artisans"], ["4.8", "Rating"]].map(([n, l]) => (
                <div key={l}><div className="font-serif text-2xl font-bold">{n}</div><div className="text-white/60 text-xs">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] row-span-2 shadow-xl">
                <SafeImage src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80" alt="Vase" label="Vase" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
                <SafeImage src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80" alt="Lamp" label="Lamp" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
                <SafeImage src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=700&q=80" alt="Textiles" label="Textiles" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-clay text-white rounded-xl px-4 py-3 shadow-lg">
              <div className="text-2xl font-bold leading-none">50% OFF</div>
              <div className="text-xs">on first order</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-white border-b border-line">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 divide-x divide-line">
          {[
            [TruckIcon, "Free Shipping", "On orders over ₹1,499"],
            [ShieldIcon, "Verified Artisans", "100% authentic"],
            [ReturnIcon, "Easy Returns", "7-day returns"],
            [LockIcon, "Secure Payments", "Protected checkout"],
          ].map(([Icon, t, s]) => (
            <div key={t} className="flex items-center gap-3 py-4 px-3 md:px-5">
              <span className="text-forest"><Icon /></span>
              <span className="leading-tight"><span className="block text-sm font-semibold">{t}</span><span className="block text-xs text-muted">{s}</span></span>
            </div>
          ))}
        </div>
      </section>

      <div className="container-x py-8 md:py-10 space-y-10">
        {/* CATEGORIES */}
        <section id="categories">
          <SectionHead title="Shop by Category" href="/products" cta="View all" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} className="group bg-white border border-line rounded-xl p-3 text-center hover:border-forest/40 hover:shadow-md transition">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-sand mb-2">
                  <SafeImage src={c.image} alt={c.name} label={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="text-xs md:text-sm font-semibold leading-tight">{c.name}</div>
                {catCount(c.slug) > 0 && <div className="text-[11px] text-muted mt-0.5">{catCount(c.slug)} products</div>}
              </Link>
            ))}
          </div>
        </section>

        {/* TRENDING */}
        <section>
          <SectionHead title="Trending Now" href="/products" cta="See all" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {trending.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
        </section>

        {/* PROMO */}
        <section className="rounded-2xl bg-clay text-white overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Deal of the week</div>
              <h3 className="font-serif text-2xl md:text-3xl font-bold mt-1">Up to 40% off on décor essentials</h3>
              <p className="opacity-90 text-sm mt-1">A curated selection to refresh every corner of your home.</p>
            </div>
            <Link href="/products" className="btn bg-white text-clay hover:bg-white/90 shrink-0">Shop the Deal →</Link>
          </div>
        </section>

        {/* COLLECTION GRID (20+) */}
        <section>
          <SectionHead title="Explore the Collection" href="/products" cta="View all" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {collection.map((p) => (<ProductCard key={p.id} product={p} />))}
          </div>
          <div className="text-center mt-8"><Link href="/products" className="btn btn-blue">View all products</Link></div>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-forest text-white">
        <div className="container-x py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Get 10% off your first order</h2>
            <p className="text-white/70 text-sm mt-1">Sign up for new drops, artisan stories and members-only offers.</p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 md:w-72 rounded-lg px-4 h-12 text-ink outline-none" />
            <button type="button" className="btn btn-primary !rounded-lg px-6">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title, href, cta }) {
  return (
    <div className="flex items-end justify-between mb-4 md:mb-5">
      <h2 className="font-serif text-xl md:text-2xl font-bold">{title}</h2>
      <Link href={href} className="text-sm text-forest font-semibold hover:underline">{cta} →</Link>
    </div>
  );
}

function TruckIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>); }
function ShieldIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ReturnIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function LockIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>); }
