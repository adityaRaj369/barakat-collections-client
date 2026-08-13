"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

const NAV = [
  { label: "New In", href: "/products?sort=newest" },
  { label: "Vases & Planters", href: "/products?category=vases-planters" },
  { label: "Lighting", href: "/products?category=lighting" },
  { label: "Home & Living", href: "/products?category=wall-decor" },
  { label: "Deals", href: "/products" },
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
      {/* utility bar */}
      <div className="bg-forest text-white/90 text-xs">
        <div className="container-x flex items-center justify-between h-9 gap-4">
          <span className="hidden sm:flex items-center gap-1.5">
            <TruckIcon /> FREE SHIPPING <span className="text-white/55">on orders over ₹1,499</span>
          </span>
          <span className="flex items-center gap-1.5">
            <TagIcon /> EXTRA 10% OFF <span className="text-white/55">on prepaid orders</span>
          </span>
          <Link href="/account" className="hidden md:inline underline underline-offset-2 hover:text-white ml-auto">
            Track Order
          </Link>
        </div>
      </div>

      {/* main bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-line">
        <div className="container-x">
          <div className="flex items-center justify-between h-16 md:h-[76px] gap-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 -ml-2" aria-label="Menu" onClick={() => setOpen(true)}>
                <Burger />
              </button>
              <Link href="/" className="flex items-center gap-2 min-w-0">
                <span className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-clay text-white grid place-items-center shrink-0">
                  <BagIcon />
                </span>
                <span className="leading-none min-w-0">
                  <span className="block font-serif text-base sm:text-xl md:text-2xl font-bold tracking-tight text-forest truncate">
                    Barakat<span className="text-clay">Collections</span>
                  </span>
                  <span className="hidden sm:block text-[10px] text-muted mt-0.5">
                    Shop Handmade. Live Beautiful.
                  </span>
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className="text-sm font-medium text-ink/80 hover:text-clay transition">
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 md:gap-5">
              {session?.user ? (
                <Link href="/account" className="hidden md:inline text-sm hover:text-clay">
                  {session.user.name?.split(" ")[0] || "Account"}
                </Link>
              ) : (
                <Link href="/login" className="hidden md:inline text-sm hover:text-clay">Sign in</Link>
              )}
              <Link href="/cart" className="relative p-1" aria-label="Cart">
                <BagIcon large />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-clay text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full grid place-items-center">
                    {count}
                  </span>
                )}
              </Link>
              <Link href="/products" className="hidden sm:inline-flex btn btn-primary !py-2.5 !px-5 text-sm !rounded-lg">
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[84%] max-w-xs bg-white flex flex-col">
            <div className="flex items-center justify-between h-16 px-5 bg-forest text-white">
              <span className="font-serif text-lg font-bold">Barakat Collections</span>
              <button onClick={() => setOpen(false)} className="text-2xl leading-none p-2">×</button>
            </div>
            <nav className="flex flex-col px-5 py-2 overflow-y-auto">
              {NAV.map((n) => (
                <Link key={n.label} href={n.href} className="py-3.5 border-b border-line text-[15px] font-medium">
                  {n.label}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <Link href="/account" className="py-3.5 border-b border-line text-[15px]">My Account</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="py-3.5 text-left text-[15px] text-muted">Sign out</button>
                </>
              ) : (
                <Link href="/login" className="py-3.5 text-[15px]">Sign in / Register</Link>
              )}
            </nav>
            <div className="mt-auto p-4">
              <Link href="/products" className="btn btn-primary w-full !rounded-lg">SHOP NOW</Link>
            </div>
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
function BagIcon({ large }) {
  const s = large ? 22 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 12l9-9 9 9-9 9z" /><circle cx="12" cy="9" r="1.1" />
    </svg>
  );
}
