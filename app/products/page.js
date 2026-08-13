import Link from "next/link";
import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { DEMO_CATEGORIES, filterDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All Handicrafts & Home Décor",
  description:
    "Browse handcrafted vases, lighting, wall décor, textiles and tableware — all handmade by Indian artisans.",
  alternates: { canonical: "/products" },
};

const SORTS = {
  featured: { label: "Featured", orderBy: [{ featured: "desc" }, { createdAt: "desc" }] },
  "price-asc": { label: "Price: Low to High", orderBy: [{ price: "asc" }] },
  "price-desc": { label: "Price: High to Low", orderBy: [{ price: "desc" }] },
  newest: { label: "Newest", orderBy: [{ createdAt: "desc" }] },
};

// price ranges in paise
const PRICES = {
  "u1000": { label: "Under ₹1,000", min: null, max: 100000 },
  "1000-2500": { label: "₹1,000 – ₹2,500", min: 100000, max: 250000 },
  "2500-5000": { label: "₹2,500 – ₹5,000", min: 250000, max: 500000 },
  "o5000": { label: "Over ₹5,000", min: 500000, max: null },
};

async function getData(sp) {
  const category = sp?.category || "";
  const q = (sp?.q || "").trim();
  const sortKey = SORTS[sp?.sort] ? sp.sort : "featured";
  const priceKey = PRICES[sp?.price] ? sp.price : "";
  const pr = PRICES[priceKey];

  const where = {};
  if (category) where.category = { slug: category };
  if (q) where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
  if (pr) {
    where.price = {};
    if (pr.min != null) where.price.gte = pr.min;
    if (pr.max != null) where.price.lte = pr.max;
  }

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ where, include: { category: true }, orderBy: SORTS[sortKey].orderBy }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    const ps = products.map(serializeProduct);
    return {
      products: ps.length ? ps : filterDemo({ category, q, sort: sortKey, minP: pr?.min ?? null, maxP: pr?.max ?? null }),
      categories: categories.length ? categories : DEMO_CATEGORIES,
      category, q, sortKey, priceKey,
    };
  } catch {
    return {
      products: filterDemo({ category, q, sort: sortKey, minP: pr?.min ?? null, maxP: pr?.max ?? null }),
      categories: DEMO_CATEGORIES,
      category, q, sortKey, priceKey,
    };
  }
}

function buildHref(base, patch) {
  const p = new URLSearchParams(base);
  Object.entries(patch).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
  const s = p.toString();
  return `/products${s ? "?" + s : ""}`;
}

export default async function ProductsPage({ searchParams }) {
  const { products, categories, category, q, sortKey, priceKey } = await getData(searchParams);
  const base = { category, q, sort: sortKey === "featured" ? "" : sortKey, price: priceKey };
  const activeCat = categories.find((c) => c.slug === category);
  const heading = q ? `Results for “${q}”` : activeCat ? activeCat.name : "All Products";

  return (
    <div className="container-x py-6 md:py-10">
      <nav className="text-xs text-muted mb-4 flex gap-2">
        <Link href="/" className="hover:text-forest">Home</Link><span>/</span>
        <span className="text-ink">{heading}</span>
      </nav>
      <div className="flex items-end justify-between mb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">{heading}</h1>
        <span className="text-sm text-muted">{products.length} products</span>
      </div>

      {/* MOBILE FILTERS (horizontal chips) */}
      <div className="lg:hidden mb-5 space-y-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          <Chip href={buildHref(base, { category: "" })} active={!category} label="All" />
          {categories.map((c) => (
            <Chip key={c.slug} href={buildHref(base, { category: c.slug })} active={category === c.slug} label={c.name} />
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {Object.entries(PRICES).map(([key, p]) => (
            <Chip key={key} href={buildHref(base, { price: priceKey === key ? "" : key })} active={priceKey === key} label={p.label} small />
          ))}
          {Object.entries(SORTS).filter(([k]) => k !== "featured").map(([key, s]) => (
            <Chip key={key} href={buildHref(base, { sort: sortKey === key ? "" : key })} active={sortKey === key} label={s.label} small />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6 md:gap-8">
        {/* FILTERS SIDEBAR (desktop) */}
        <aside className="hidden lg:block lg:sticky lg:top-24 self-start">
          <div className="bg-white border border-line rounded-xl divide-y divide-line">
            <FilterGroup title="Categories">
              <FilterLink href={buildHref(base, { category: "" })} active={!category} label="All Categories" />
              {categories.map((c) => (
                <FilterLink key={c.slug} href={buildHref(base, { category: c.slug })} active={category === c.slug} label={c.name} />
              ))}
            </FilterGroup>
            <FilterGroup title="Price">
              <FilterLink href={buildHref(base, { price: "" })} active={!priceKey} label="All Prices" />
              {Object.entries(PRICES).map(([key, p]) => (
                <FilterLink key={key} href={buildHref(base, { price: key })} active={priceKey === key} label={p.label} />
              ))}
            </FilterGroup>
            <FilterGroup title="Sort by">
              {Object.entries(SORTS).map(([key, s]) => (
                <FilterLink key={key} href={buildHref(base, { sort: key === "featured" ? "" : key })} active={sortKey === key} label={s.label} />
              ))}
            </FilterGroup>
          </div>
        </aside>

        {/* GRID */}
        <div>
          {products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map((p) => (<ProductCard key={p.id} product={p} />))}
            </div>
          ) : (
            <div className="py-24 text-center text-muted">
              <p>No products match these filters.</p>
              <Link href="/products" className="btn btn-blue mt-6 inline-flex">Clear filters</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ href, active, label, small }) {
  return (
    <Link
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 ${
        small ? "py-1 text-xs" : "py-1.5 text-sm"
      } transition ${
        active ? "bg-forest text-white border-forest" : "bg-white border-line text-ink/80"
      }`}
    >
      {label}
    </Link>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="p-4">
      <h3 className="label text-muted mb-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function FilterLink({ href, active, label }) {
  return (
    <Link
      href={href}
      className={`block text-sm px-2 py-1.5 rounded-md transition ${
        active ? "bg-forest text-white font-medium" : "text-ink/80 hover:bg-sand"
      }`}
    >
      {label}
    </Link>
  );
}
