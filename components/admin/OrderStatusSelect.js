"use client";

import { useState } from "react";

export default function OrderStatusSelect({ id, status }) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function change(e) {
    const next = e.target.value;
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (res.ok) setValue(next);
  }

  return (
    <select
      value={value}
      onChange={change}
      disabled={saving}
      className="input !py-1.5 !px-2 text-xs w-auto"
    >
      <option value="PENDING">PENDING</option>
      <option value="PAID">PAID</option>
      <option value="FAILED">FAILED</option>
    </select>
  );
}
