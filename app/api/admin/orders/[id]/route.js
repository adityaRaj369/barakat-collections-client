import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { orderStatusInput } from "@/lib/validations";

export async function PATCH(req, { params }) {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = orderStatusInput.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
