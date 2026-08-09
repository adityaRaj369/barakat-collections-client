import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { razorpayEnabled } from "@/lib/razorpay";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { orderId } = body;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "PAID") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  // DEMO mode — mark as paid without a gateway.
  if (!razorpayEnabled || order.demo) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", demo: true },
    });
    return NextResponse.json({ ok: true, demo: true });
  }

  // Real Razorpay — verify the payment signature.
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(razorpay_signature)
    );

  if (!valid) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      razorpayPayId: razorpay_payment_id,
    },
  });

  return NextResponse.json({ ok: true });
}
