"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("cursor-on");

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    const isInteractive = (t) =>
      t && t.closest && t.closest("a,button,input,select,textarea,[data-hover]");
    const over = (e) => isInteractive(e.target) && ring.current?.classList.add("is-hover");
    const out = (e) => isInteractive(e.target) && ring.current?.classList.remove("is-hover");

    addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, true);
    document.addEventListener("mouseout", out, true);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-on");
      removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over, true);
      document.removeEventListener("mouseout", out, true);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cur-ring" aria-hidden />
      <div ref={dot} className="cur-dot" aria-hidden />
    </>
  );
}
