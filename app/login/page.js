import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <Suspense fallback={<div className="text-center text-muted">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
