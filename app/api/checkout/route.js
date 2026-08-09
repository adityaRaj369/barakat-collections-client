import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { razorpayEnabled, getRazorpay } from "@/lib/razorpay";
import { rateLimit, clientIp } from "@/lib/ratelimit";

const FREE_SHIPPING_THRESHOLD = 149900; // ₹1,499
const SHIPPING_FEE = 9900; // ₹99

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to checkout." }, { status: 401 });
  }

  const rl = rateLimit(`checkout:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }
  const { address, items } = parsed.data;

  // Recompute everything from the DB — never trust client-sent prices.
  const ids = items.map((i) => i.id);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  if (products.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  const lineItems = [];
  let subtotal = 0;
  for (const it of items) {
    const product = products.find((p) => p.id === it.id);
    if (!product) continue;
    const qty = Math.min(it.quantity, product.stock || 20);
    if (qty <= 0) continue;
    subtotal += product.price * qty;
    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
    });
  }
  if (lineItems.length === 0) {
    return NextResponse.json({ error: "No purchasable items." }, { status: 400 });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const amount = subtotal + shipping;

  // Create the order in PENDING state.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      email: address.email,
      fullName: address.fullName,
      phone: address.phone,
      address: JSON.stringify(address),
      amount,
      currency: "INR",
      status: "PENDING",
      demo: !razorpayEnabled,
      items: { create: lineItems },
    },
  });

  if (!razorpayEnabled) {
    // DEMO mode — no real payment gateway configured.
    return NextResponse.json({
      demo: true,
      orderId: order.id,
      amount,
    });
  }

  // Real Razorpay order.
  try {
    const rp = getRazorpay();
    const rpOrder = await rp.orders.create({
      amount, // paise
      currency: "INR",
      receipt: order.id,
      notes: { orderId: order.id },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rpOrder.id },
    });
    return NextResponse.json({
      demo: false,
      orderId: order.id,
      razorpayOrderId: rpOrder.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      prefill: { name: address.fullName, email: address.email, contact: address.phone },
    });
  } catch (e) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 }
    );
  }
}
