// Prices are stored in paise (integer). Helpers to display + parse.

export function formatPrice(paise) {
  const rupees = (Number(paise) || 0) / 100;
  return "₹" + rupees.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function rupees(paise) {
  return (Number(paise) || 0) / 100;
}

// Product images are stored as a JSON string in SQLite.
export function parseImages(images) {
  if (Array.isArray(images)) return images;
  if (!images) return [];
  try {
    const arr = JSON.parse(images);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// Turn a DB product row into a plain, client-safe object.
export function serializeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    images: parseImages(p.images),
    material: p.material ?? null,
    artisan: p.artisan ?? null,
    origin: p.origin ?? null,
    stock: p.stock,
    featured: p.featured,
    rating: p.rating,
    category: p.category
      ? { name: p.category.name, slug: p.category.slug }
      : null,
    categorySlug: p.category?.slug ?? null,
  };
}
