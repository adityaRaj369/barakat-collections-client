"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

const CATEGORIES = [
  { label: "All Categories", slug: "" },
  { label: "Vases & Planters", slug: "vases-planters" },
  { label: "Lighting", slug: "lighting" },
  { label: "Wall Décor", slug: "wall-decor" },
  { label: "Textiles & Cushions", slug: "textiles-cushions" },
  { label: "Tableware", slug: "tableware" },
  { label: "Décor Accents", slug: "decor-accents" },
];

export default function Header() {
  const { count } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  function search(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cat) p.set("category", cat);
    router.push(`/products${p.toString() ? "?" + p.toString() : ""}`);
  }

  return (
    <>
      {/* utility bar */}
      <div className="bg-forest text-white/90 text-xs">
        <div className="container-x flex items-center justify-between h-9 gap-3">
          <span className="hidden sm:inline truncate">Handcrafted décor, direct from Indian artisans</span>
          <span className="flex items-center gap-3 ml-auto whitespace-nowrap">
            <Link href="/account" className="hover:text-white">Track Order</Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link href="#" className="hidden sm:inline hover:text-white">Help</Link>
            <span className="text-white/30">|</span>
            {session?.user ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="hover:text-white">Sign out</button>
            ) : (
              <Link href="/login" className="hover:text-white">Sign In</Link>
            )}
          </span>
        </div>
      </div>

      {/* main bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-line shadow-sm">
        <div className="container-x">
          <div className="flex items-center gap-3 md:gap-4 h-16 md:h-[74px]">
            <button className="lg:hidden p-2 -ml-2" aria-label="Menu" onClick={() => setOpen(true)}>
              <Burger />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
              <span className="w-9 h-9 rounded-lg bg-forest text-white grid place-items-center shrink-0">
                <BagIcon />
              </span>
              <span className="leading-none hidden sm:block min-w-0">
                <span className="block font-serif text-lg md:text-xl font-bold tracking-tight text-forest truncate">
                  Barakat<span className="text-clay">Collections</span>
                </span>
                <span className="block text-[10px] text-muted">Artisan Marketplace</span>
              </span>
            </Link>

            <form onSubmit={search} className="flex-1 hidden md:flex items-stretch max-w-2xl mx-auto border-2 border-forest/25 rounded-lg overflow-hidden focus-within:border-forest">
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-sand text-sm px-3 border-r border-line outline-none max-w-[150px]">
                {CATEGORIES.map((c) => (<option key={c.label} value={c.slug}>{c.label}</option>))}
              </select>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for vases, lamps, textiles and more…" className="flex-1 px-3 outline-none text-sm" />
              <button type="submit" className="bg-forest text-white px-6 text-sm font-semibold hover:bg-forestDark flex items-center gap-2">
                <SearchIcon /> <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            <div className="flex items-center gap-4 ml-auto md:ml-0">
              <Link href={session?.user ? "/account" : "/login"} className="hidden md:flex flex-col items-center text-[11px] text-ink hover:text-forest">
                <UserIcon /><span>{session?.user ? "Account" : "Sign in"}</span>
              </Link>
              <Link href="/cart" className="relative flex flex-col items-center text-[11px] text-ink hover:text-forest">
                <span className="relative">
                  <BagIcon large />
                  {count > 0 && (<span className="absolute -top-1.5 -right-2 bg-clay text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full grid place-items-center">{count}</span>)}
                </span>
                <span>Cart</span>
              </Link>
            </div>
          </div>

          {/* mobile search */}
          <form onSubmit={search} className="md:hidden pb-3 flex items-stretch border-2 border-forest/25 rounded-lg overflow-hidden">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="flex-1 px-3 py-2.5 outline-none text-sm" />
            <button type="submit" className="bg-forest text-white px-5"><SearchIcon /></button>
          </form>
        </div>

        {/* category strip */}
        <div className="bg-white border-t border-line hidden md:block">
          <div className="container-x">
            <div className="flex items-center gap-6 h-11 overflow-x-auto no-scrollbar text-sm">
              {CATEGORIES.slice(1).map((c) => (
                <Link key={c.slug} href={`/products?category=${c.slug}`} className="whitespace-nowrap text-ink/80 hover:text-forest font-medium">
                  {c.label}
                </Link>
              ))}
              <Link href="/products" className="whitespace-nowrap text-clay font-semibold ml-auto">All Products →</Link>
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
              <span className="label text-muted mt-3 mb-1">Categories</span>
              {CATEGORIES.slice(1).map((c) => (
                <Link key={c.slug} href={`/products?category=${c.slug}`} className="py-3 border-b border-line text-[15px]">{c.label}</Link>
              ))}
              <Link href="/products" className="py-3 border-b border-line text-[15px] font-semibold text-clay">All Products</Link>
              {session?.user ? (
                <>
                  <Link href="/account" className="py-3 border-b border-line text-[15px]">My Account</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="py-3 text-left text-[15px] text-muted">Sign out</button>
                </>
              ) : (
                <Link href="/login" className="py-3 text-[15px]">Sign in / Register</Link>
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
      <span className="block h-[2px] bg-ink" /><span className="block h-[2px] bg-ink" /><span className="block h-[2px] bg-ink w-2/3" />
    </div>
  );
}
function BagIcon({ large }) {
  const s = large ? 22 : 20;
  return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>);
}
function SearchIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>);
}
function UserIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>);
}
