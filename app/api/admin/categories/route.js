import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { categoryInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";

export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = categoryInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );

  const d = parsed.data;
  let slug = d.slug ? slugify(d.slug) : slugify(d.name);
  // ensure unique
  if (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const category = await prisma.category.create({
    data: {
      name: d.name,
      slug,
      description: d.description || null,
      image: d.image || null,
    },
  });
  return NextResponse.json({ category }, { status: 201 });
}
