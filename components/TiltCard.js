"use client";

import { useRef } from "react";

export default function TiltCard({ children, className = "", max = 8 }) {
  const ref = useRef(null);
  function move(e) {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "rotateX(0) rotateY(0)";
  }
  return (
    <div style={{ perspective: "900px" }} className={className}>
      <div ref={ref} onMouseMove={move} onMouseLeave={reset} className="tilt3d h-full">
        {children}
      </div>
    </div>
  );
}
