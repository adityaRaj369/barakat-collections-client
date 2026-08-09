"use client";

import { useEffect, useState } from "react";

const EMPTY = { name: "", slug: "", description: "", image: "" };

export default function CategoryManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // id or "new" or null
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setRows(data.categories || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setForm(EMPTY);
    setEditing("new");
    setError("");
  }
  function startEdit(c) {
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
    });
    setEditing(c.id);
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url =
      editing === "new"
        ? "/api/admin/categories"
        : `/api/admin/categories/${editing}`;
    const method = editing === "new" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setError(data.error || "Save failed");
    setEditing(null);
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this category? Products will be uncategorised.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="label text-clay">Catalogue</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold">Categories</h1>
        </div>
        <button onClick={startNew} className="btn btn-primary">
          + New category
        </button>
      </div>

      {editing !== null && (
        <form onSubmit={save} className="card p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="label text-muted block mb-1.5">Name</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="label text-muted block mb-1.5">Slug (optional)</span>
            <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label text-muted block mb-1.5">Image URL</span>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </label>
          <label className="block sm:col-span-2">
            <span className="label text-muted block mb-1.5">Description</span>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          {error && <p className="text-clay text-sm sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2 flex gap-3">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-muted">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-sand/60 text-muted">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">Slug</th>
                <th className="text-left font-medium px-4 py-3">Products</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted hidden sm:table-cell">{c.slug}</td>
                  <td className="px-4 py-3">{c._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(c)} className="text-clay hover:text-clayDark mr-4">
                      Edit
                    </button>
                    <button onClick={() => remove(c.id)} className="text-muted hover:text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
