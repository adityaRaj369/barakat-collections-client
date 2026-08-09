import prisma from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const staticRoutes = ["", "/products", "/login", "/register"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let dynamicRoutes = [];
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, createdAt: true } }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);
    dynamicRoutes = [
      ...categories.map((c) => ({
        url: `${siteUrl}/products?category=${c.slug}`,
        changeFrequency: "weekly",
        priority: 0.6,
      })),
      ...products.map((p) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: p.createdAt,
        changeFrequency: "weekly",
        priority: 0.8,
      })),
    ];
  } catch {
    // DB not ready — ship the static routes only.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
