import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { productInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ products });
}

export async function POST(req) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = productInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );

  const d = parsed.data;
  let slug = d.slug ? slugify(d.slug) : slugify(d.name);
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      description: d.description,
      price: Math.round(d.priceRupees * 100),
      compareAtPrice:
        d.compareAtRupees != null && d.compareAtRupees > 0
          ? Math.round(d.compareAtRupees * 100)
          : null,
      images: JSON.stringify(d.images || []),
      material: d.material || null,
      artisan: d.artisan || null,
      origin: d.origin || null,
      stock: d.stock ?? 0,
      featured: !!d.featured,
      rating: d.rating ?? 4.7,
      categoryId: d.categoryId || null,
    },
  });
  return NextResponse.json({ product }, { status: 201 });
}
