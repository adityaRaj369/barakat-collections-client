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

async function getData(searchParams) {
  const category = searchParams?.category || "";
  const q = (searchParams?.q || "").trim();
  const sortKey = SORTS[searchParams?.sort] ? searchParams.sort : "featured";

  const where = {};
  if (category) where.category = { slug: category };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: SORTS[sortKey].orderBy,
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    const productsS = products.map(serializeProduct);
    return {
      products: productsS.length ? productsS : filterDemo({ category, q, sort: sortKey }),
      categories: categories.length ? categories : DEMO_CATEGORIES,
      category,
      q,
      sortKey,
    };
  } catch {
    return {
      products: filterDemo({ category, q, sort: sortKey }),
      categories: DEMO_CATEGORIES,
      category,
      q,
      sortKey,
    };
  }
}

export default async function ProductsPage({ searchParams }) {
  const { products, categories, category, q, sortKey } = await getData(searchParams);
  const activeCat = categories.find((c) => c.slug === category);
  const heading = q
    ? `Results for “${q}”`
    : activeCat
    ? activeCat.name
    : "All Products";

  const chip = (href, label, active) => (
    <Link
      key={label}
      href={href}
      className={`label px-4 py-2 rounded-full border transition ${
        active
          ? "bg-ink text-cream border-ink"
          : "border-line text-ink hover:border-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="container-x py-10 md:py-14">
      <div className="mb-8">
        <p className="label text-clay">Shop</p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold mt-1">
          {heading}
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div className="flex flex-wrap gap-2">
          {chip("/products", "All", !category && !q)}
          {categories.map((c) =>
            chip(`/products?category=${c.slug}`, c.name, category === c.slug)
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label text-muted tabular-nums">
            {products.length} items
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SORTS).map(([key, s]) => {
              const params = new URLSearchParams();
              if (category) params.set("category", category);
              if (q) params.set("q", q);
              params.set("sort", key);
              return (
                <Link
                  key={key}
                  href={`/products?${params.toString()}`}
                  className={`text-xs px-2.5 py-1.5 rounded-full border ${
                    sortKey === key
                      ? "border-clay text-clay"
                      : "border-line text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-muted">
          <p>No products found.</p>
          <p className="mt-2 text-sm">
            If this is a fresh install, run <code>npm run db:seed</code>.
          </p>
        </div>
      )}
    </div>
  );
}
