import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { demoAdminBypassEnabled, isAdmin } from "@/lib/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  if (demoAdminBypassEnabled()) {
    return (
      <div className="md:flex min-h-screen bg-cream">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");

  if (!isAdmin(session)) {
    return (
      <div className="container-x py-28 text-center">
        <p className="label text-clay">403</p>
        <h1 className="font-serif text-3xl font-semibold mt-2">
          Admin access only
        </h1>
        <p className="text-muted mt-3 max-w-md mx-auto">
          Your account ({session.user.email}) isn't an admin. Add your email to{" "}
          <code>ADMIN_EMAILS</code> in <code>.env</code>, then sign out and back
          in.
        </p>
        <Link href="/" className="btn btn-primary mt-8 inline-flex">
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="md:flex min-h-screen bg-cream">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
