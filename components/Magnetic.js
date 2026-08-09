"use client";

import { useRef } from "react";

export default function Magnetic({ children, strength = 24, className = "" }) {
  const ref = useRef(null);
  function move(e) {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x / r.width) * strength}px, ${
      (y / r.height) * strength
    }px)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }
  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={reset}
      className={`inline-flex transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </span>
  );
}
