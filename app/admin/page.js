import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [products, categories, orders, paid, recent, lowStock] =
      await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.order.count(),
        prisma.order.findMany({ where: { status: "PAID" }, select: { amount: true } }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { items: true },
        }),
        prisma.product.findMany({
          where: { stock: { lte: 5 } },
          take: 5,
          orderBy: { stock: "asc" },
        }),
      ]);
    const revenue = paid.reduce((n, o) => n + o.amount, 0);
    return { products, categories, orders, revenue, recent, lowStock };
  } catch {
    return { products: 0, categories: 0, orders: 0, revenue: 0, recent: [], lowStock: [] };
  }
}

const STATUS = {
  PAID: "bg-olive/15 text-olive",
  PENDING: "bg-clay/15 text-clay",
  FAILED: "bg-red-100 text-red-600",
};

export default async function AdminDashboard() {
  const s = await getStats();
  const cards = [
    ["Revenue", formatPrice(s.revenue), "from paid orders"],
    ["Orders", s.orders, "all time"],
    ["Products", s.products, "in catalogue"],
    ["Categories", s.categories, "live"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label text-clay">Dashboard</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold">Overview</h1>
        </div>
        <Link href="/admin/products" className="btn btn-primary hidden md:inline-flex">
          + New product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([label, value, sub]) => (
          <div key={label} className="card p-5">
            <div className="label text-muted">{label}</div>
            <div className="font-serif text-2xl md:text-3xl mt-1">{value}</div>
            <div className="text-xs text-muted mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm hover-underline">
              View all →
            </Link>
          </div>
          {s.recent.length === 0 ? (
            <p className="text-muted text-sm py-6 text-center">No orders yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {s.recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3 gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-sm">
                      #{o.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-xs text-muted truncate">
                      {o.fullName} · {o.items.length} item(s)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS[o.status] || ""}`}>
                      {o.status}
                    </span>
                    <span className="tabular-nums text-sm">{formatPrice(o.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-serif text-xl font-semibold mb-4">Low stock</h2>
          {s.lowStock.length === 0 ? (
            <p className="text-muted text-sm py-6 text-center">All well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {s.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate mr-2">{p.name}</span>
                  <span className="text-clay font-medium">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/products" className="btn btn-outline w-full mt-5">
            Manage products
          </Link>
        </div>
      </div>
    </div>
  );
}
