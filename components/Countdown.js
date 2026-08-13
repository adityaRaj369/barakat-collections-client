"use client";

import { useEffect, useState } from "react";

function getTarget() {
  const t = new Date();
  t.setHours(23, 59, 59, 999);
  return t.getTime();
}

export default function Countdown() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const tick = () => setMs(Math.max(0, getTarget() - Date.now()));
    tick();
    const id = setInterval(tick, 60);
    return () => clearInterval(id);
  }, []);

  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");

  const Block = ({ v, l }) => (
    <div className="text-center">
      <div className="bg-forest text-white rounded-lg w-12 md:w-14 py-2 font-bold text-lg tabular-nums">
        {v}
      </div>
      <div className="text-[9px] uppercase tracking-wide text-muted mt-1">{l}</div>
    </div>
  );

  return (
    <div className="flex items-start gap-1.5 md:gap-2">
      <Block v={h} l="Hrs" />
      <Block v={m} l="Mins" />
      <Block v={s} l="Secs" />
      <Block v={cs} l="Msec" />
    </div>
  );
}
