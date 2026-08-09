# BARAKAT COLLECTIONS — Handcrafted Living

A production-ready **handicraft & home-décor e-commerce** starter built with **Next.js 14 (App Router)**, **Prisma**, **NextAuth** and a **Razorpay-ready** checkout. It ships with a demo catalogue and runs end-to-end with **zero paid services** — then flips to real Google login and real Razorpay payments the moment you add keys.

## Highlights

- **Full-stack**: Next.js frontend + API routes, one `npm run dev`.
- **Real database** via Prisma (SQLite out of the box, one-line switch to Postgres).
- **Auth**: email + password (bcrypt) *and* Google OAuth (optional).
- **Payments**: Razorpay integration wired end-to-end. With **no keys it runs in DEMO mode** (orders placed, no charge); add keys and it becomes a real gateway with server-side signature verification.
- **SEO**: per-page metadata, Open Graph, `Product` JSON-LD, dynamic `sitemap.xml` and `robots.txt`, semantic markup.
- **Security**: hashed passwords, Zod validation, server-side price recomputation, HMAC payment verification, security headers, protected routes, basic rate limiting.
- **Warm, artisanal UI**, fully responsive.

## Quick start

```bash
cd kalakart
cp .env.example .env          # then edit values (see below)
npm install                   # runs `prisma generate` automatically
npm run db:push               # create the SQLite database from the schema
npm run db:seed               # load the demo catalogue (6 categories, 18 products)
npm run dev                   # http://localhost:3000
```

Minimum `.env` to boot (demo mode, no external accounts needed):

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

That's it — you can browse, register with email/password, add to cart, and place a **demo order** immediately.

## Enabling Google login (optional)

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add redirect URI: `http://localhost:3000/api/auth/callback/google`.
3. Put the values in `.env`:
   ```
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```
4. Restart. The "Continue with Google" button appears automatically.

## Enabling Razorpay payments (when the client is ready)

1. Get keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).
2. Add them to `.env`:
   ```
   RAZORPAY_KEY_ID="rzp_test_xxx"
   RAZORPAY_KEY_SECRET="xxx"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxx"
   ```
3. Restart. Checkout now opens the real Razorpay widget and the server verifies the payment signature before marking an order **PAID**. No code changes required — the app detects the keys.

## Admin dashboard

BARAKAT COLLECTIONS ships with a full admin dashboard at **`/admin`** to manage everything the storefront shows.

**Become an admin:** add your email to `ADMIN_EMAILS` in `.env` (comma-separated), then register/sign in with that email. Admins see an "Admin dashboard" button on their account page.

```
ADMIN_EMAILS="you@example.com"
```

From the dashboard you can:

- **Overview** — revenue (from paid orders), order/product/category counts, recent orders, low-stock alerts.
- **Products** — create, edit and delete products: name, description, price, compare-at price, multiple image URLs, material/artisan/origin, stock, category, rating, and the "Bestseller" homepage flag.
- **Categories** — create, edit and delete categories (deleting one un-categorises its products).
- **Orders** — view every order with customer + shipping details and change the status (Pending / Paid / Failed).

Everything is server-side and **role-protected** — the `/admin` routes and all `/api/admin/*` endpoints reject non-admins.

## Is the backend complete?

Yes. What's built and working end-to-end:

- Database schema + Prisma client (users, accounts/sessions, categories, products, orders, order items).
- Auth: email/password (bcrypt) + Google OAuth + JWT sessions + protected routes + admin roles.
- Catalogue read APIs (via server components) and full **admin CRUD APIs** with Zod validation.
- Cart → **server-priced checkout** → order persistence → payment verification.
- SEO: metadata, Open Graph, JSON-LD, sitemap, robots.

**The only things left to flip on for go-live:**

1. **Database** — point `DATABASE_URL` at a real DB (see below).
2. **Razorpay** — add the three keys to `.env`.

That's it. No code changes required for either.

## SEO — yes, it's optimised

- Per-page **metadata** + title templates + canonical URLs (`app/layout.js`, per route).
- **Open Graph** + Twitter cards; product pages set OG images from the product.
- **`Product` JSON-LD** structured data on every product page (price, availability, rating) for Google rich results.
- Dynamic **`/sitemap.xml`** (home, shop, every category + product) and **`/robots.txt`** (blocks `/admin`, `/account`, `/checkout`, `/api`).
- Semantic HTML, descriptive `alt` text, fast server-rendered pages.

Before go-live: set `NEXT_PUBLIC_SITE_URL` to your real domain so canonical URLs and the sitemap use it.

## Switching to Postgres for production

1. In `prisma/schema.prisma` change `provider = "sqlite"` → `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Postgres URL.
3. `npx prisma migrate dev` then `npm run db:seed`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the app (frontend + backend) |
| `npm run build` | `prisma generate` + production build |
| `npm run db:push` | Create/sync the DB from the schema |
| `npm run db:migrate` | Create a migration (recommended for prod) |
| `npm run db:seed` | Load the demo catalogue |
| `npm run db:studio` | Open Prisma Studio to browse data |
| `npm run db:reset` | Wipe + recreate + reseed |

## Project structure

```
app/
  page.js                    home
  products/                  listing + [slug] detail (SEO + JSON-LD)
  cart/ checkout/            bag + checkout (Razorpay/demo)
  login/ register/ account/  auth + order history
  api/
    auth/[...nextauth]/      NextAuth handler
    register/                sign-up (bcrypt + zod + rate limit)
    checkout/                creates order + Razorpay order (server-priced)
    payment/verify/          HMAC signature verification
  sitemap.js  robots.js      SEO
components/                  Header, Footer, ProductCard, ProductDetail, cart, forms
lib/                         prisma, auth, razorpay, validations, format, ratelimit
prisma/                      schema.prisma + seed.js
```

## Security notes

- Passwords hashed with bcrypt (cost 12); never stored in plain text.
- All checkout prices are **recomputed on the server** from the DB — client totals are never trusted.
- Razorpay payments verified with an HMAC-SHA256 signature check (`timingSafeEqual`).
- Inputs validated with Zod; `/account` and `/checkout` require a session.
- Security headers set in `next.config.js`. Tighten the CSP for your domains before go-live, and move rate limiting to Redis for multi-instance deploys.
- Keep real secrets in `.env` (git-ignored) or your host's secret manager — never commit them.
