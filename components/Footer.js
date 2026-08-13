import Link from "next/link";

const ic = "w-4 h-4";
const SOCIALS = [
  () => (<svg className={ic} viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V4.9C15.7 4.9 14.8 4.8 13.8 4.8 11.6 4.8 10 6.1 10 8.7V11H7.4v3H10v8z"/></svg>),
  () => (<svg className={ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>),
  () => (<svg className={ic} viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-6.6 7.5L21.5 21h-5.4l-4.2-5.5L6.9 21H3.9l7-8L2.9 3h5.5l3.8 5z"/></svg>),
  () => (<svg className={ic} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2-1.4-3.5-3.9-3.5-2.8 0-4.6 2.1-4.6 4.5 0 .8.2 1.4.6 1.8.2.2.2.3.1.5l-.2.9c-.1.3-.3.4-.6.2-1.1-.5-1.7-1.8-1.7-3.4 0-2.8 2.3-6.1 6.9-6.1 3.7 0 6.1 2.7 6.1 5.5 0 3.8-2.1 6.6-5.2 6.6-1 0-2-.6-2.3-1.2l-.7 2.5c-.2.8-.7 1.7-1.1 2.4A10 10 0 1 0 12 2z"/></svg>),
];

export default function Footer() {
  const cols = [
    {
      title: "Shop",
      links: [
        ["All Products", "/products"],
        ["Vases & Planters", "/products?category=vases-planters"],
        ["Lighting", "/products?category=lighting"],
        ["Wall Décor", "/products?category=wall-decor"],
        ["Textiles", "/products?category=textiles-cushions"],
        ["Tableware", "/products?category=tableware"],
      ],
    },
    {
      title: "Customer Care",
      links: [
        ["Track Order", "/account"],
        ["Shipping Policy", "#"],
        ["Returns & Refunds", "#"],
        ["FAQs", "#"],
        ["Contact Us", "#contact"],
      ],
    },
    {
      title: "Company",
      links: [
        ["About Us", "#"],
        ["Our Artisans", "#"],
        ["Terms & Conditions", "#"],
        ["Privacy Policy", "#"],
        ["Sell on Barakat", "#"],
      ],
    },
  ];

  return (
    <footer className="bg-forestDark text-white/85">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-lg bg-clay text-white grid place-items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
              </span>
              <span className="font-serif text-xl font-semibold text-white">
                Barakat <span className="text-goldSoft">Collections</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              India's marketplace for handcrafted home décor, direct from
              artisans at honest prices.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((S, i) => (
                <span key={i} className="w-9 h-9 rounded-full bg-white/10 grid place-items-center hover:bg-clay transition cursor-pointer">
                  <S />
                </span>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="label text-white/50 mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/75 hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div id="contact" className="mt-10 pt-8 border-t border-white/10 grid gap-6 md:grid-cols-2 text-sm">
          <div>
            <h4 className="label text-white/50 mb-2">Registered office</h4>
            <address className="not-italic text-white/70 leading-relaxed">
              BARKAT COLLECTIONS · 1st Floor, BLK-B, House No 33, Shiv Mandir,
              Moolchand Colony, Adarsh Nagar, New Delhi, North West Delhi,
              Delhi — 110033
            </address>
          </div>
          <div className="md:text-right text-white/70">
            <h4 className="label text-white/50 mb-2">Business</h4>
            Trade name: BARKAT COLLECTIONS · Constitution: Proprietorship
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} BARAKAT COLLECTIONS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
