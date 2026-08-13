import Link from "next/link";
import prisma from "@/lib/prisma";
import { serializeProduct, formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Countdown from "@/components/Countdown";
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from "@/lib/demoData";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [featured, latest, categories] = await Promise.all([
      prisma.product.findMany({ where: { featured: true }, include: { category: true }, take: 12, orderBy: { createdAt: "desc" } }),
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
    return {
      featured: DEMO_PRODUCTS.filter((p) => p.featured),
      latest: DEMO_PRODUCTS,
      categories: DEMO_CATEGORIES,
    };
  }
}

export default async function HomePage() {
  const { featured, latest, categories } = await getData();
  const arrivals = latest.slice(0, 5);
  const collection = latest.slice(0, 20);
  const deal = featured.find((p) => p.compareAtPrice) || latest.find((p) => p.compareAtPrice) || latest[0];
  const catCount = (slug) => latest.filter((p) => p.categorySlug === slug).length;
  const dealDisc =
    deal?.compareAtPrice && deal.compareAtPrice > deal.price
      ? Math.round(((deal.compareAtPrice - deal.price) / deal.compareAtPrice) * 100)
      : 40;

  return (
    <div className="container-x py-5 md:py-7 space-y-6 md:space-y-8">
      {/* ===== HERO ===== */}
      <section className="rounded-3xl bg-forest text-white overflow-hidden">
        <div className="grid lg:grid-cols-2 items-center">
          <div className="p-7 md:p-12">
            <span className="inline-block bg-white/12 text-white/90 text-[11px] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
              Limited time only
            </span>
            <h1 className="font-serif font-bold leading-[1.02] text-4xl md:text-6xl mt-5">
              Shop More,
              <br />
              <span className="text-clay">Save More!</span>
            </h1>
            <p className="text-white/70 mt-4 max-w-sm">
              Discover amazing deals on your favourite handcrafted décor.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
              {[
                [PriceIcon, "Best Prices", "Guaranteed"],
                [ShieldIcon, "Secure", "Payments"],
                [TruckIcon, "Fast Delivery", "Worldwide"],
              ].map(([Icon, a, b]) => (
                <div key={a} className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-white">
                    <Icon />
                  </span>
                  <span className="text-xs leading-tight">
                    {a}<br /><span className="text-white/55">{b}</span>
                  </span>
                </div>
              ))}
            </div>
            <Link href="/products" className="btn btn-primary mt-7 inline-flex !rounded-lg">
              EXPLORE COLLECTION →
            </Link>
          </div>
          <div className="relative min-h-[280px] lg:min-h-[420px]">
            <SafeImage
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=80"
              alt="Featured décor"
              label="Barakat Collections"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest/60 to-transparent lg:from-forest/30" />
            <div className="absolute top-6 right-6 md:top-10 md:right-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-clay text-white grid place-items-center text-center font-bold leading-tight shadow-lg rotate-6">
              <span className="text-[11px]">
                UP TO<br /><span className="text-2xl">50%</span><br />OFF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="rounded-2xl bg-peach">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-clay/10">
          {[
            [TruckIcon, "Free Shipping", "On orders over ₹1,499"],
            [ReturnIcon, "Easy Returns", "30-day returns"],
            [BadgeIcon, "Premium Quality", "100% original products"],
            [SupportIcon, "24/7 Support", "We're here to help"],
          ].map(([Icon, t, s]) => (
            <div key={t} className="flex items-center gap-3 p-4 md:p-6">
              <span className="text-forest"><Icon /></span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{t}</span>
                <span className="block text-xs text-muted">{s}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="pt-3">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-7">Shop By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.slice(0, 6).map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="group bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition">
              <div className="aspect-square bg-sand overflow-hidden">
                <SafeImage src={c.image} alt={c.name} label={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 text-center">
                <div className="text-sm font-semibold truncate">{c.name}</div>
                <div className="text-xs text-clay mt-0.5">Shop Now → {catCount(c.slug) ? `(${catCount(c.slug)})` : ""}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== DEAL OF THE DAY ===== */}
      {deal && (
        <section className="rounded-3xl bg-peach overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 items-center p-6 md:p-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-clay">Deal of the Day</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight mt-2">
                Grab It Before<br />It's Gone!
              </h2>
              <p className="text-muted mt-3">Hurry! Limited stock available.</p>
              <Link href={`/products/${deal.slug}`} className="btn btn-primary mt-6 inline-flex !rounded-lg">
                SHOP THE DEAL →
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-36 h-36 rounded-xl overflow-hidden bg-sand shrink-0">
                <SafeImage src={deal.images?.[0]} alt={deal.name} label={deal.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-lg leading-tight">{deal.name}</h3>
                <p className="text-xs text-muted">{deal.category?.name || "Handcrafted"}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-clay text-2xl font-bold">{formatPrice(deal.price)}</span>
                  {deal.compareAtPrice && (
                    <span className="text-muted line-through">{formatPrice(deal.compareAtPrice)}</span>
                  )}
                  <span className="text-xs font-bold text-forest">-{dealDisc}%</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-muted mb-1">Only {deal.stock ?? 12} items left!</div>
                  <div className="h-1.5 rounded-full bg-sand overflow-hidden">
                    <div className="h-full bg-clay rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
                <div className="mt-4"><Countdown /></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== NEW ARRIVALS ===== */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">New Arrivals</h2>
          <Link href="/products?sort=newest" className="text-sm text-clay font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} badge="New" />
          ))}
        </div>
      </section>

      {/* ===== EXPLORE COLLECTION (20+) ===== */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl md:text-3xl font-bold">Explore the Collection</h2>
          <Link href="/products" className="text-sm text-clay font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {collection.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="rounded-3xl bg-forest text-white overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-clay text-white grid place-items-center">
              <MailIcon />
            </span>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Get Exclusive Offers &amp; Updates</h2>
              <p className="text-white/70 text-sm mt-1">Sign up now and get 10% OFF on your first order!</p>
            </div>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input type="email" placeholder="Enter your email address" className="flex-1 md:w-72 rounded-lg px-4 h-12 text-ink outline-none" />
            <button type="button" className="btn btn-primary !rounded-lg px-6">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* icons */
function PriceIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12l9-9 9 9-9 9z"/><circle cx="12" cy="9" r="1.2"/></svg>); }
function ShieldIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function TruckIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>); }
function ReturnIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function BadgeIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="9" r="5"/><path d="M9 13l-1.5 8L12 18l4.5 3L15 13" strokeLinejoin="round"/></svg>); }
function SupportIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="3.5" height="6" rx="1.5"/><rect x="17.5" y="13" width="3.5" height="6" rx="1.5"/></svg>); }
function MailIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>); }
