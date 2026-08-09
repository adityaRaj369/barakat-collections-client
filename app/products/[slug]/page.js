import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { serializeProduct, rupees } from "@/lib/format";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getProduct(slug) {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    return p ? serializeProduct(p) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  const desc = product.description.slice(0, 160);
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: desc,
      images: product.images?.length ? [{ url: product.images[0] }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await prisma.product
    .findMany({
      where: {
        category: product.categorySlug
          ? { slug: product.categorySlug }
          : undefined,
        NOT: { slug: product.slug },
      },
      include: { category: true },
      take: 4,
    })
    .catch(() => []);

  // Product structured data for SEO (Google rich results).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "BARAKAT COLLECTIONS" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 42,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: rupees(product.price).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteUrl}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={product}
        related={related.map(serializeProduct)}
      />
    </>
  );
}
