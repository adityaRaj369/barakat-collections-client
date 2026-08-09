import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders · Admin", robots: { index: false } };

async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-6">
        <p className="label text-clay">Sales</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">Orders</h1>
      </div>

      <div className="card overflow-x-auto">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-sand/60 text-muted">
              <tr>
                <th className="text-left font-medium px-4 py-3">Order</th>
                <th className="text-left font-medium px-4 py-3">Customer</th>
                <th className="text-left font-medium px-4 py-3">Items</th>
                <th className="text-left font-medium px-4 py-3">Total</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => {
                let addr = {};
                try {
                  addr = JSON.parse(o.address);
                } catch {}
                return (
                  <tr key={o.id} className="align-top">
                    <td className="px-4 py-3 font-mono">
                      #{o.id.slice(-8).toUpperCase()}
                      {o.demo && (
                        <span className="ml-1 text-[10px] text-muted">demo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.fullName}</div>
                      <div className="text-xs text-muted">{o.email}</div>
                      {addr.city && (
                        <div className="text-xs text-muted">
                          {addr.city}, {addr.state}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ul className="text-xs text-ink/70">
                        {o.items.map((it) => (
                          <li key={it.id}>
                            {it.quantity}× {it.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatPrice(o.amount)}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect id={o.id} status={o.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
