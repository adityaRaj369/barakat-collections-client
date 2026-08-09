import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import AuroraBackground from "@/components/AuroraBackground";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BARAKAT COLLECTIONS — Handcrafted Living | Home Décor & Handicrafts",
    template: "%s | BARAKAT COLLECTIONS",
  },
  description:
    "BARAKAT COLLECTIONS brings home handcrafted décor, artisanal homeware and gifts made by Indian craftspeople. Shop ethically made vases, lamps, textiles and more.",
  keywords: [
    "handicrafts",
    "home decor",
    "handmade",
    "artisan",
    "Indian handicrafts",
    "handcrafted gifts",
    "home accessories",
  ],
  openGraph: {
    type: "website",
    siteName: "BARAKAT COLLECTIONS",
    title: "BARAKAT COLLECTIONS — Handcrafted Living",
    description:
      "Handcrafted décor and homeware made by Indian artisans. Ethically made, beautifully imperfect.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "BARAKAT COLLECTIONS — Handcrafted Living",
    description: "Handcrafted décor and homeware made by Indian artisans.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport = {
  themeColor: "#c1614a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuroraBackground />
        <Providers>
          <Preloader />
          <Cursor />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
