"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Overview", href: "/admin", icon: "◧" },
  { label: "Products", href: "/admin/products", icon: "▦" },
  { label: "Categories", href: "/admin/categories", icon: "❏" },
  { label: "Orders", href: "/admin/orders", icon: "▤" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-ink text-cream px-4 h-14">
        <Link href="/admin" className="font-serif text-lg font-semibold">
          BARAKAT COLLECTIONS <span className="text-terracotta">Admin</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="text-2xl">
          ≡
        </button>
      </div>

      <aside
        className={`md:sticky md:top-0 md:h-screen w-full md:w-64 shrink-0 bg-ink text-cream flex-col ${
          open ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="hidden md:block px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="font-serif text-xl font-semibold">
            BARAKAT COLLECTIONS <span className="text-terracotta">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                isActive(n.href)
                  ? "bg-white/10 text-cream"
                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`}
            >
              <span className="opacity-80">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-white/5"
          >
            ↗ View store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-white/5"
          >
            ⇦ Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
