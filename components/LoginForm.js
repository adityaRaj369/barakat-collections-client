"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, getProviders } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);

  useEffect(() => {
    getProviders().then((p) => setHasGoogle(!!p?.google)).catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-center">Welcome back</h1>
      <p className="text-center text-muted mt-2">Sign in to your BARAKAT COLLECTIONS account</p>

      {hasGoogle && (
        <>
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="btn btn-outline w-full mt-8"
          >
            Continue with Google
          </button>
          <div className="flex items-center gap-4 my-6 text-muted text-sm">
            <span className="flex-1 h-px bg-line" /> or <span className="flex-1 h-px bg-line" />
          </div>
        </>
      )}

      <form onSubmit={submit} className={hasGoogle ? "space-y-4" : "space-y-4 mt-8"}>
        <div>
          <label className="label text-muted block mb-1.5">Email</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label text-muted block mb-1.5">Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        New here?{" "}
        <Link href="/register" className="text-clay hover-underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
