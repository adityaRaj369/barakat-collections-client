import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { isAdmin } from "@/lib/admin";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Account",
  robots: { index: false, follow: true },
};

const STATUS_STYLE = {
  PAID: "text-olive",
  PENDING: "text-clay",
  FAILED: "text-red-600",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const orders = await prisma.order
    .findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="container-x py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="label text-clay">My Account</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-1">
            Hello, {session.user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-muted mt-1">{session.user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin(session) && (
            <Link href="/admin" className="btn btn-primary">
              Admin dashboard
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      <h2 className="font-serif text-2xl font-semibold mb-5">Your orders</h2>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            let addr = {};
            try {
              addr = JSON.parse(o.address);
            } catch {}
            return (
              <div key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                  <div>
                    <span className="label text-muted">Order</span>{" "}
                    <span className="font-mono text-sm">
                      #{o.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <span className={`font-semibold ${STATUS_STYLE[o.status] || ""}`}>
                      {o.status}
                      {o.demo ? " (demo)" : ""}
                    </span>
                  </div>
                </div>
                <div className="pt-3 flex flex-wrap justify-between gap-4">
                  <ul className="text-sm text-ink/80 space-y-1">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.quantity} × {it.name} —{" "}
                        {formatPrice(it.price * it.quantity)}
                      </li>
                    ))}
                  </ul>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(o.amount)}</div>
                    {addr.city && (
                      <div className="text-xs text-muted mt-1">
                        Ship to {addr.city}, {addr.state}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
