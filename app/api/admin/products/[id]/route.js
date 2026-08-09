import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { productInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

export async function PATCH(req, { params }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = productInput.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );

  const d = parsed.data;
  const data = {};
  if (d.name !== undefined) data.name = d.name;
  if (d.slug) data.slug = slugify(d.slug);
  if (d.description !== undefined) data.description = d.description;
  if (d.priceRupees !== undefined) data.price = Math.round(d.priceRupees * 100);
  if (d.compareAtRupees !== undefined)
    data.compareAtPrice =
      d.compareAtRupees && d.compareAtRupees > 0
        ? Math.round(d.compareAtRupees * 100)
        : null;
  if (d.images !== undefined) data.images = JSON.stringify(d.images || []);
  if (d.material !== undefined) data.material = d.material || null;
  if (d.artisan !== undefined) data.artisan = d.artisan || null;
  if (d.origin !== undefined) data.origin = d.origin || null;
  if (d.stock !== undefined) data.stock = d.stock;
  if (d.featured !== undefined) data.featured = !!d.featured;
  if (d.rating !== undefined) data.rating = d.rating;
  if (d.categoryId !== undefined) data.categoryId = d.categoryId || null;

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function DELETE(_req, { params }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
