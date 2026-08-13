import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { demoAdminBypassEnabled } from "@/lib/admin";

export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  if (demoAdminBypassEnabled()) redirect("/admin");

  return (
    <div className="container-x py-16 md:py-24">
      <Suspense fallback={<div className="text-center text-muted">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
