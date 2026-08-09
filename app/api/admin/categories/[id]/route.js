import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { categoryInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

export async function PATCH(req, { params }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = categoryInput.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );

  const d = parsed.data;
  const data = {};
  if (d.name !== undefined) data.name = d.name;
  if (d.description !== undefined) data.description = d.description || null;
  if (d.image !== undefined) data.image = d.image || null;
  if (d.slug) data.slug = slugify(d.slug);

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
}

export async function DELETE(_req, { params }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    // detach products from this category, then delete it
    await prisma.product.updateMany({
      where: { categoryId: params.id },
      data: { categoryId: null },
    });
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
}
