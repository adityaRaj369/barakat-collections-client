import Link from "next/link";

export default function Footer() {
  const cols = [
    {
      title: "Shop",
      links: [
        ["All Products", "/products"],
        ["Vases & Planters", "/products?category=vases-planters"],
        ["Lighting", "/products?category=lighting"],
        ["Wall Décor", "/products?category=wall-decor"],
        ["Textiles & Cushions", "/products?category=textiles-cushions"],
      ],
    },
    {
      title: "Help",
      links: [
        ["Shipping & Returns", "#"],
        ["Track Order", "/account"],
        ["Care Guide", "#"],
        ["Contact", "#"],
      ],
    },
    {
      title: "Company",
      links: [
        ["Our Artisans", "#"],
        ["Sustainability", "#"],
        ["Journal", "#"],
        ["About", "#"],
      ],
    },
  ];

  return (
    <footer className="bg-ink text-cream/90 mt-8">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="font-serif text-2xl font-semibold text-cream">
              Barakat <span className="text-terracotta">Collections</span>
            </div>
            <p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-xs">
              Handcrafted décor and homeware, made by Indian artisans. Ethically
              made, beautifully imperfect.
            </p>
            <form className="mt-5 flex border-b border-cream/30 max-w-xs">
              <input
                placeholder="Email for 10% off"
                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-cream/50 text-cream"
              />
              <button type="button" className="label text-terracotta">
                Join
              </button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="label text-cream/60 mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-cream/80 hover:text-cream"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Registered business details */}
        <div className="mt-12 pt-8 border-t border-cream/15 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="label text-cream/60 mb-3">Registered office</h4>
            <address className="not-italic text-sm text-cream/80 leading-relaxed">
              BARKAT COLLECTIONS
              <br />
              1st Floor, BLK-B, House No 33
              <br />
              Shiv Mandir, Moolchand Colony
              <br />
              Adarsh Nagar, New Delhi
              <br />
              North West Delhi, Delhi — 110033
            </address>
          </div>
          <div className="md:text-right">
            <h4 className="label text-cream/60 mb-3">Business details</h4>
            <p className="text-sm text-cream/80 leading-relaxed">
              Trade name: BARKAT COLLECTIONS
              <br />
              Constitution: Proprietorship
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="label text-cream/50">
            © {new Date().getFullYear()} BARAKAT COLLECTIONS
          </span>
          <span className="label text-cream/50">
            Crafted with care · Secure checkout
          </span>
        </div>
      </div>
    </footer>
  );
}
