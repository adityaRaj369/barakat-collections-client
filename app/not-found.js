import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <p className="label text-clay">404</p>
      <h1 className="font-serif text-4xl font-semibold mt-2">Page not found</h1>
      <p className="text-muted mt-3">
        The page you're looking for has wandered off.
      </p>
      <Link href="/" className="btn btn-primary mt-8 inline-flex">
        Back home
      </Link>
    </div>
  );
}
