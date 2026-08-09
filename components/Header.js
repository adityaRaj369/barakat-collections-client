"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

const NAV = [
  { label: "Shop All", href: "/products" },
  { label: "Vases & Planters", href: "/products?category=vases-planters" },
  { label: "Lighting", href: "/products?category=lighting" },
  { label: "Wall Décor", href: "/products?category=wall-decor" },
  { label: "Textiles", href: "/products?category=textiles-cushions" },
];

export default function Header() {
  const { count } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-line">
      <div className="bg-ink text-cream text-center py-1.5">
        <span className="label">Handmade in India · Free shipping over ₹1,499</span>
      </div>
      <div className="container-x">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              className="md:hidden p-2 -ml-2"
              aria-label="Menu"
              onClick={() => setOpen(true)}
            >
              <Burger />
            </button>
            <nav className="hidden md:flex items-center gap-6">
              {NAV.slice(1).map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="text-sm text-ink/75 hover:text-ink hover-underline"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="shrink-0" aria-label="BARAKAT COLLECTIONS home">
            <span className="font-serif text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-ink whitespace-nowrap">
              Barakat <span className="text-clay">Collections</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-5 flex-1 justify-end">
            {session?.user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/account" className="text-sm hover-underline">
                  {session.user.name?.split(" ")[0] || "Account"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-muted hover:text-ink"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline text-sm hover-underline">
                Sign in
              </Link>
            )}
            <Link href="/cart" className="relative flex items-center gap-1.5 text-sm">
              <BagIcon />
              <span className="tabular-nums">{count}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>

      {/* mobile drawer — sibling of <header> so `fixed` anchors to the viewport
          (a blurred ancestor would otherwise become its containing block) */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[84%] max-w-xs bg-cream flex flex-col">
            <div className="flex items-center justify-between h-16 px-5 border-b border-line">
              <span className="font-serif text-xl font-semibold">BARAKAT COLLECTIONS</span>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none p-2">
                ×
              </button>
            </div>
            <nav className="flex flex-col px-5 py-2 overflow-y-auto">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="py-3.5 border-b border-line text-[15px]"
                >
                  {n.label}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <Link href="/account" className="py-3.5 border-b border-line text-[15px]">
                    My Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="py-3.5 text-left text-[15px] text-muted"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="py-3.5 text-[15px]">
                  Sign in / Register
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function Burger() {
  return (
    <div className="w-6 h-6 flex flex-col justify-center gap-[5px]">
      <span className="block h-[2px] bg-ink" />
      <span className="block h-[2px] bg-ink" />
      <span className="block h-[2px] bg-ink w-2/3" />
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
