"use client";

import { useEffect, useState } from "react";
import { formatPrice, parseImages } from "@/lib/format";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  priceRupees: "",
  compareAtRupees: "",
  imagesText: "",
  material: "",
  artisan: "",
  origin: "",
  stock: 10,
  featured: false,
  rating: 4.7,
  categoryId: "",
};

export default function ProductManager() {
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [pr, cr] = await Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]);
    setRows(pr.products || []);
    setCats(cr.categories || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  function startNew() {
    setForm(EMPTY);
    setEditing("new");
    setError("");
  }
  function startEdit(p) {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceRupees: p.price / 100,
      compareAtRupees: p.compareAtPrice ? p.compareAtPrice / 100 : "",
      imagesText: parseImages(p.images).join("\n"),
      material: p.material || "",
      artisan: p.artisan || "",
      origin: p.origin || "",
      stock: p.stock,
      featured: p.featured,
      rating: p.rating,
      categoryId: p.categoryId || "",
    });
    setEditing(p.id);
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      priceRupees: Number(form.priceRupees) || 0,
      compareAtRupees: form.compareAtRupees ? Number(form.compareAtRupees) : null,
      images: form.imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      material: form.material,
      artisan: form.artisan,
      origin: form.origin,
      stock: Number(form.stock) || 0,
      featured: !!form.featured,
      rating: Number(form.rating) || 4.7,
      categoryId: form.categoryId || "",
    };
    const url = editing === "new" ? "/api/admin/products" : `/api/admin/products/${editing}`;
    const res = await fetch(url, {
      method: editing === "new" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Save failed");
    setEditing(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="label text-clay">Catalogue</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold">Products</h1>
        </div>
        <button onClick={startNew} className="btn btn-primary">
          + New product
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={save} className="card p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <Field label="Name" value={form.name} onChange={set("name")} />
          <Field label="Slug (optional)" value={form.slug} onChange={set("slug")} placeholder="auto from name" />
          <div className="sm:col-span-2">
            <span className="label text-muted block mb-1.5">Description</span>
            <textarea className="input" rows={3} value={form.description} onChange={set("description")} />
          </div>
          <Field label="Price (₹)" type="number" value={form.priceRupees} onChange={set("priceRupees")} />
          <Field label="Compare-at price (₹, optional)" type="number" value={form.compareAtRupees} onChange={set("compareAtRupees")} />
          <div className="sm:col-span-2">
            <span className="label text-muted block mb-1.5">Image URLs (one per line)</span>
            <textarea className="input" rows={3} value={form.imagesText} onChange={set("imagesText")} placeholder="https://…/image1.jpg" />
          </div>
          <Field label="Material" value={form.material} onChange={set("material")} />
          <Field label="Artisan" value={form.artisan} onChange={set("artisan")} />
          <Field label="Origin" value={form.origin} onChange={set("origin")} />
          <label className="block">
            <span className="label text-muted block mb-1.5">Category</span>
            <select className="input" value={form.categoryId} onChange={set("categoryId")}>
              <option value="">— none —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Stock" type="number" value={form.stock} onChange={set("stock")} />
          <Field label="Rating (0–5)" type="number" value={form.rating} onChange={set("rating")} />
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={set("featured")} className="w-4 h-4" />
            <span className="text-sm">Feature on homepage (Bestseller)</span>
          </label>
          {error && <p className="text-clay text-sm sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save product"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-muted">
            No products yet. Click "New product" or run <code>npm run db:seed</code>.
          </p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-sand/60 text-muted">
              <tr>
                <th className="text-left font-medium px-4 py-3">Product</th>
                <th className="text-left font-medium px-4 py-3">Category</th>
                <th className="text-left font-medium px-4 py-3">Price</th>
                <th className="text-left font-medium px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((p) => {
                const img = parseImages(p.images)[0];
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-12 rounded-lg overflow-hidden bg-sand shrink-0">
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          ) : null}
                        </span>
                        <span className="font-medium">
                          {p.name}
                          {p.featured && (
                            <span className="ml-2 text-[10px] uppercase tracking-wide text-clay">
                              ★ featured
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(p)} className="text-clay hover:text-clayDark mr-4">
                        Edit
                      </button>
                      <button onClick={() => remove(p.id)} className="text-muted hover:text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="label text-muted block mb-1.5">{label}</span>
      <input type={type} className="input" value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}
